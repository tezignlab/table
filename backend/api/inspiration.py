import re

from bson import ObjectId
from fastapi import Depends

from api import router_public, current_user_id
from api.file import nd_files
from db import mongo
from fastlab.models import Response, PageData
from models.inspiration import *
from utils import TimeUtils, FileUtils

nd_inspirations = mongo["naodong"]["inspirations"]


def _files(file_ids: List[ObjectId]):
    files = list(nd_files.find({'_id': {'$in': file_ids}}))
    return {str(x['_id']): FileInfo(id=str(x['_id']),
                                    content_type=x['content_type'],
                                    url=FileUtils.url(x['path']),
                                    thumbnail=FileUtils.thumbnail(x['path'], x['content_type'])) for x in files}


def _extra_files(inspirations: List):
    """
    Add extra fields: `files`
    """
    files = _files([ObjectId(y) for x in inspirations for y in x['file_ids']])
    for item in inspirations:
        item['id'] = str(item['_id'])
        item['files'] = [files.get(x) for x in item['file_ids']]
 

@router_public.get("/api/v1/inspirations", tags=["Inspiration"], summary="Inspiration list", response_model=Response[PageData[Inspiration]])
async def inspiration_list(skip: int = 0, limit: int = 20, user_id: str = Depends(current_user_id)):
    _filter = {'user_id': user_id}
    result = list(nd_inspirations.find(_filter).skip(skip).limit(limit).sort([('create_time', -1)]))
    total = nd_inspirations.count_documents(_filter)
    _extra_files(result)
    return Response(data=PageData(skip=skip, limit=limit, total=total, has_more=total > skip + limit, list=result))


@router_public.post("/api/v1/inspiration", tags=["Inspiration"], summary="Create inspiration", response_model=Response[Inspiration])
async def inspiration_new(body: InspirationBody, user_id: str = Depends(current_user_id)):
    files = _files([ObjectId(x) for x in body.file_ids])
    tags = list(re.findall(r'#[\S]+', body.content))
    body = body.dict()
    body.update({
        'tags': tags,
        'user_id': user_id,
        'create_time': TimeUtils.now_timestamp()
    })
    result = nd_inspirations.insert_one(body)
    return Response(data=Inspiration(
        id=str(result.inserted_id),
        files=[files.get(x) for x in body['file_ids']],
        **body
    ))


@router_public.put("/api/v1/inspiration/{inspiration_id}", tags=["Inspiration"], summary="Update inspiration", response_model=Response[Inspiration])
async def inspiration_update(inspiration_id: str, body: InspirationBody, user_id: str = Depends(current_user_id)):
    files = _files([ObjectId(x) for x in body.file_ids])
    tags = list(re.findall(r'#[\S]+', body.content))
    body = body.dict()
    body.update({'tags': tags, 'update_time': TimeUtils.now_timestamp()})
    nd_inspirations.update_one({'_id': ObjectId(inspiration_id), 'user_id': user_id}, {'$set': body})
    return Response(data=Inspiration(
        id=inspiration_id,
        files=[files.get(x) for x in body['file_ids']],
        **body
    ))


@router_public.delete("/api/v1/inspiration/{inspiration_id}", tags=["Inspiration"], summary="Delete inspiration", response_model=Response[bool])
async def inspiration_delete(inspiration_id: str, user_id: str = Depends(current_user_id)):
    nd_inspirations.delete_one({'_id': ObjectId(inspiration_id), 'user_id': user_id})
    return Response(data=True)
