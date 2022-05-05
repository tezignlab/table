from bson import ObjectId
from fastapi import Depends, Request
from starlette.background import BackgroundTasks

from api import router_public, current_user_id, optional_user_id
from api.user import nd_user, get_user
from api.user import random_avatar
from config import conf
from db import mongo
from fastlab.models import Response, PageData
from models.project import *
from service import ESService
from utils import TimeUtils
from db import es

nd_project = mongo['table']['project']
nd_project_collection = mongo['table']['project-collection']
nd_project_collect = mongo['table']['project-collect']
nd_project_like = mongo['table']['project-like']
nd_project_view = mongo['table']['project-view']
nd_user_black = mongo['table']['user-black']

project_ID_PROJECTION = {'_id': 0, 'project_id': 1}
project_PROJECTION = {'content': 0, 'crawler_time': 0}


async def _extra_project_field(request: Request, project_list: List):
    """
    Add extra fields：`is_like`、`is_collect`
    """
    user_id = await optional_user_id(request)
    project_ids = [str(x['_id']) for x in project_list]
    user_likes = {}
    if user_id:
        _filter = {'user_id': user_id, 'project_id': {'$in': project_ids}}
        user_likes = {x['project_id'] for x in list(nd_project_like.find(_filter, project_ID_PROJECTION))}
    for item in project_list:
        item['id'] = str(item['_id'])
        if user_id:
            item['is_like'] = item['id'] in user_likes

            # find projects collections
            collection_ids = [x['collection_id'] for x in list(nd_project_collect.find({'user_id': user_id, 'project_id': item['id']}, {'_id': 0, 'collection_id': 1}))]
            collection_ids = [ObjectId(item) for item in collection_ids]
            collections = nd_project_collection.find({'_id': {'$in': collection_ids}})
            collections = [{**item, 'id': str(item['_id'])} for item in collections]
            item['collections'] = list(collections)
        if not item['author']['avatar']:
            item['author']['avatar'] = random_avatar()


def _collections_with_cover(user_id: str, cover_size: int):
    """
    Get user's collections with covers
    """
    collections = list(nd_project_collection.aggregate([{
        '$match': {"user_id": user_id}
    }, {
        '$sort': {'create_time': -1}
    }, {
        '$lookup': {
            "from": 'project-collect',
            "let": {"collectionId": {"$toString": "$_id"}},
            "pipeline": [{'$match': {"$expr": {"$eq": ["$collection_id", "$$collectionId"]}}},
                         {'$sort': {'time': -1}},
                         {'$limit': cover_size},
                         {'$project': {'_id': 0, 'project_id': 1}}],
            "as": "collected_projects"
        }
    }, {
        '$project': {'user_id': 0, 'update_time': 0}
    }]))
    if not collections:
        return []
    project_ids = [ObjectId(y['project_id']) for x in collections for y in x['collected_projects']]
    project_map = {str(x['_id']): x['cover'] for x in nd_project.find({'_id': {'$in': project_ids}}, {'_id': 1, 'cover': 1})}
    for item in collections:
        item['id'] = str(item['_id'])
        item['covers'] = list(filter(lambda x: x is not None, [project_map.get(x['project_id']) for x in item['collected_projects']]))
    return collections


@router_public.get("/api/v1/projects", summary='project list', response_model=Response[PageData[BaseProject]], tags=['project'])
async def projects(request: Request, skip: int = 0, limit: int = 20):
    _filter = {'origin': {"$ne": 'topys'}}
    result = list(nd_project.find(_filter, project_PROJECTION).skip(skip).limit(limit).sort([('publish_time', -1)]))
    total = nd_project.count_documents(_filter)
    await _extra_project_field(request, result)
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, data=result))


@router_public.get("/api/v1/projects/{project_id}", summary='project detail', response_model=Response[Project], tags=['project'])
async def project_detail(request: Request, project_id: str):
    projection = {'crawler_time': 0, 'v2content': 0}
    doc = nd_project.find_one({'_id': ObjectId(project_id)}, projection)
    doc['id'] = str(doc['_id'])
    user_id = await optional_user_id(request)
    if user_id:
        doc['is_like'] = nd_project_like.find_one({'user_id': user_id, 'project_id': project_id}) is not None
        
        # find projects collections
        collection_ids = [x['collection_id'] for x in list(nd_project_collect.find({'user_id': user_id, 'project_id': doc['id']}, {'_id': 0, 'collection_id': 1}))]
        collection_ids = [ObjectId(item) for item in collection_ids]
        collections = nd_project_collection.find({'_id': {'$in': collection_ids}})
        collections = [{**item, 'id': str(item['_id'])} for item in collections]
        doc['collections'] = list(collections)

    return Response(data=doc)


@router_public.get("/api/v1/project/search", summary='Search projects', response_model=Response[PageData[BaseProject]], tags=['project'])
async def project_search(request: Request, task: BackgroundTasks, keyword: str, skip: int = 0, limit: int = 20):
    query = ESService.project_search_query(keyword, skip, limit)
    resp = es.search(index=conf['elasticsearch']['index'], body=query)
    total = resp["hits"]['total']['value']
    project_ids = [x["_id"] for x in resp["hits"]["hits"]]
    if not project_ids:
        return Response(data=PageData(skip=skip, limit=limit, total=0, has_more=False, data=[]))
    docs = list(nd_project.find({'_id': {'$in': [ObjectId(x) for x in project_ids]}}, project_PROJECTION))
    await _extra_project_field(request, docs)
    docs.sort(key=lambda item: project_ids.index(item['id']))
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, data=docs))


@router_public.get("/api/v1/project/recommend", summary='Recommended projects', response_model=Response[PageData[BaseProject]], tags=['project'])
async def project_recommend(request: Request, skip: int = 0, limit: int = 20):
    cursor = nd_project.aggregate([{
        '$match': {
            'origin': {"$ne": 'topys'}
        },
    }, {
        '$sample': {
            'size': limit
        },
    }, {
        '$project': project_PROJECTION
    }])
    docs= list(cursor)
    await _extra_project_field(request, docs)
    return Response(data=PageData(skip=skip, limit=limit, total=0, has_more=True, data=docs))


@router_public.get("/api/v1/project/likes/{user_id}", summary='Liked projects', response_model=Response[PageData[BaseProject]], tags=['project'])
async def likes(request: Request, user_id: str, skip: int = 0, limit: int = 20):
    user = get_user({'_id': ObjectId(user_id)})
    if not user:
        return Response(data=PageData())
    _filter = {'user_id': str(user['_id'])}
    result = list(nd_project_like.find(_filter, project_ID_PROJECTION).skip(skip).limit(limit).sort([('time', -1)]))
    total = nd_project_like.count_documents(_filter)
    if not result:
        return Response(data=PageData())
    project_ids = [ObjectId(x['project_id']) for x in result]
    docs = list(nd_project.find({'_id': {'$in': project_ids}}, project_PROJECTION))
    docs.sort(key=lambda x: project_ids.index(x['_id']))
    await _extra_project_field(request, docs)
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, data=docs))


@router_public.put("/api/v1/project/like/{project_id}", summary='Like', response_model=Response, tags=['project'])
async def do_like(project_id: str, user_id: str = Depends(current_user_id)):
    _filter = {'user_id': user_id, 'project_id': project_id}
    doc = {'$set': {'user_id': user_id, 'project_id': project_id, 'time': TimeUtils.now_timestamp()}}
    result = nd_project_like.update_one(_filter, doc, upsert=True)
    if result.upserted_id:
        nd_project.update_one({'_id': ObjectId(project_id)}, {'$inc': {'count_like': 1}})
    return Response()


@router_public.delete("/api/v1/project/like/{project_id}", summary='Dislike', response_model=Response, tags=['project'])
async def cancel_like(project_id: str, user_id: str = Depends(current_user_id)):
    result = nd_project_like.delete_one({'user_id': user_id, 'project_id': project_id})
    if result.deleted_count:
        nd_project.update_one({'_id': ObjectId(project_id)}, {'$inc': {'count_like': -1}})
    return Response()


@router_public.get("/api/v1/project/collections/{user_id}", summary='Collection list', response_model=Response[List[Collection]], tags=['Collection'])
async def collection_list(user_id: str):
    docs = _collections_with_cover(user_id, 3)
    return Response(data=docs)


@router_public.post("/api/v1/project/collection", summary='Create collection', response_model=Response[Collection], tags=['Collection'])
async def create_collection(body: CollectionBody, user_id: str = Depends(current_user_id)):
    body = body.dict()
    body['user_id'] = user_id
    body['create_time'] = TimeUtils.now_timestamp()
    result = nd_project_collection.insert_one(body)
    body['id'] = str(result.inserted_id)
    return Response(data=body)


@router_public.get("/api/v1/project/collection/{collection_id}", summary='Collection detail', response_model=Response[UserCollection], tags=['Collection'])
async def update_collection(collection_id: str):
    collection = nd_project_collection.find_one({'_id': ObjectId(collection_id)})
    user = nd_user.find_one({'_id': ObjectId(collection['user_id'])})
    user['id'] = str(user['_id'])
    collection['user'] = user
    collection['id'] = str(collection_id)
    return Response(data=collection)


@router_public.put("/api/v1/project/collection/{collection_id}", summary='Update collection', response_model=Response, tags=['Collection'])
async def update_collection(collection_id: str, body: CollectionBody, user_id: str = Depends(current_user_id)):
    body = body.dict()
    body['update_time'] = TimeUtils.now_timestamp()
    nd_project_collection.update_one({'_id': ObjectId(collection_id), 'user_id': user_id}, {'$set': body})
    return Response()


@router_public.delete("/api/v1/project/collection/{collection_id}", summary='Delete collection', response_model=Response, tags=['Collection'])
async def delete_collection(collection_id: str, user_id: str = Depends(current_user_id)):
    nd_project_collection.delete_one({'_id': ObjectId(collection_id), 'user_id': user_id})
    nd_project_collect.delete_many({'user_id': user_id, 'collection_id': collection_id})
    return Response()


@router_public.get("/api/v1/project/collect/{collection_id}", summary='Collection project list', response_model=Response[PageData[BaseProject]], tags=['Collection'])
async def collect_list(request: Request, collection_id: str, skip: int = 0, limit: int = 20):
    _filter = {'collection_id': collection_id}
    result = list(nd_project_collect.find(_filter, project_ID_PROJECTION).skip(skip).limit(limit).sort([('time', -1)]))
    total = nd_project_collect.count_documents(_filter)
    if not result:
        return Response(data=PageData(skip=skip, limit=limit, total=0, has_more=False, data=[]))
    project_ids = [ObjectId(x['project_id']) for x in result]
    docs = list(nd_project.find({'_id': {'$in': project_ids}}, project_PROJECTION))
    docs.sort(key=lambda x: project_ids.index(x['_id']))
    await _extra_project_field(request, docs)
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, data=docs))


@router_public.get("/api/v1/project/{project_id}/collections", summary='project collection list', response_model=Response[List[CollectCollection]], tags=['Collection'])
async def collection_list(project_id: str, user_id: str = Depends(current_user_id)):
    collection_ids = [x['collection_id'] for x in list(nd_project_collect.find({'user_id': user_id, 'project_id': project_id}, {'_id': 0, 'collection_id': 1}))]
    docs = _collections_with_cover(user_id, 1)
    for doc in docs:
        doc['is_collect'] = doc['id'] in collection_ids
    return Response(data=docs)


@router_public.post("/api/v1/project/{project_id}/collect/{collection_id}", summary='Collect project', response_model=Response, tags=['Collection'])
async def do_collect(project_id: str, collection_id: str, user_id: str = Depends(current_user_id)):
    _filter = {'user_id': user_id, 'collection_id': collection_id, 'project_id': project_id}
    doc = {'$set': {'user_id': user_id, 'collection_id': collection_id, 'project_id': project_id, 'time': TimeUtils.now_timestamp()}}
    nd_project_collect.update_one(_filter, doc, upsert=True)
    return Response()


@router_public.delete("/api/v1/project/{project_id}/collect/{collection_id}", summary='Uncollect project', response_model=Response, tags=['Collection'])
async def cancel_collect(project_id: str, collection_id: str, user_id: str = Depends(current_user_id)):
    nd_project_collect.delete_one({'user_id': user_id, 'project_id': project_id, 'collection_id': collection_id})
    return Response()


@router_public.post("/api/v1/project/view/{project_id}", summary='View project', response_model=Response[bool], tags=['project'])
async def do_view(request: Request, project_id: str):
    user_id = await optional_user_id(request)
    if user_id:
        _filter = {'user_id': user_id, 'project_id': project_id}
        doc = {'$set': {'user_id': user_id, 'project_id': project_id, 'time': TimeUtils.now_timestamp()}}
        nd_project_view.update_one(_filter, doc, upsert=True)
    nd_project.update_one({'_id': ObjectId(project_id)}, {'$inc': {'count_read': 1}})
    return Response(data=True)


@router_public.get("/api/v1/project/views", summary='Get project view list', response_model=Response[PageData[BaseProject]], tags=['project'])
async def views(request: Request, skip: int = 0, limit: int = 20, user_id: str = Depends(current_user_id)):
    _filter = {'user_id': user_id}
    result = list(nd_project_view.find(_filter, project_ID_PROJECTION).skip(skip).limit(limit).sort([('time', -1)]))
    total = nd_project_view.count_documents(_filter)
    if not result:
        return Response(data=PageData(skip=skip, limit=limit, total=0, has_more=False, data=[]))
    project_ids = [ObjectId(x['project_id']) for x in result]
    docs = list(nd_project.find({'_id': {'$in': project_ids}}, project_PROJECTION))
    docs.sort(key=lambda x: project_ids.index(x['_id']))
    await _extra_project_field(request, docs)
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, data=docs))


@router_public.delete("/api/v1/project/view/{project_id}", summary='Delete project view', response_model=Response, tags=['project'])
async def delete_view(project_id: str, user_id: str = Depends(current_user_id)):
    nd_project_view.delete_one({'user_id': user_id, 'project_id': project_id})
    return Response()
