import os
import uuid
from pathlib import Path
from fastapi import Depends, File, UploadFile

from api import router_public, current_user_id
from db import mongo
from models import Response
from models.file import FileInfo
from utils import TimeUtils, FileUtils

nd_files = mongo["table"]["files"]


@router_public.post("/api/v1/file/upload", tags=["File"], summary="Upload", response_model=Response[FileInfo])
async def file_upload(file: UploadFile = File(..., description='file'), user_id: str = Depends(current_user_id)):
    tmp_path = f'{Path(__file__).parent}/static/assets/{TimeUtils.ymd()}'
    if not os.path.exists(tmp_path):
        os.makedirs(tmp_path)
    file_path = f'{tmp_path}/{str(uuid.uuid4()).replace("-", "")}'
    with open(file_path, 'wb') as f:
        [f.write(chunk) for chunk in iter(lambda: file.file.read(10240), b'')]
    result = nd_files.insert_one({
        'user_id': user_id,
        'name': file.filename,
        'path': file_path,
        'content_type': file.content_type,
        'create_time': TimeUtils.now_timestamp()
    })
    return Response(data=FileInfo(id=str(result.inserted_id),
                                  content_type=file.content_type,
                                  url=FileUtils.url(file_path),
                                  thumbnail=FileUtils.thumbnail(file_path, file.content_type)))
