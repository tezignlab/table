from typing import List

from fastapi import Query

from api import router_public
from db import mongo
from fastlab.models import Response
from models.help import KeywordCategoryEnum

table_keywords = mongo["table"]["keywords"]


@router_public.get("/api/v1/help/keywords", tags=["Search"], summary="Hot search keywords", response_model=Response[List[str]])
async def search_keywords(category: KeywordCategoryEnum = Query(KeywordCategoryEnum.KEYWORD, description='category')):
    result = list(table_keywords.find({'category': category}, {'_id': 0}).sort([('order', 1)]))
    return Response(data=[x['content'] for x in result])
