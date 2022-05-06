from fastapi import Header
from api import router_public
from db import mongo
from fastapi.responses import RedirectResponse
from typing import Optional


table_download = mongo["table"]["download"]


@router_public.get("/api/download", tags=["Download"], summary="Auto download")
async def download(user_agent: Optional[str] = Header(None)):
    if user_agent:
        if 'iPhone' in user_agent or 'iPad' in user_agent:
            doc = table_download.find_one({'platform': 'ios'})
            return RedirectResponse(url=doc['url'])
        if 'Android' in user_agent:
            doc = table_download.find_one({'platform': 'android'})
            return RedirectResponse(url=doc['url'])
    doc = table_download.find_one({'platform': 'default'})
    return RedirectResponse(url=doc['url'])
