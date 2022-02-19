from typing import List, Optional

from pydantic import BaseModel, Field

from models.file import FileInfo


class InspirationBody(BaseModel):
    content: str = Field(...)
    file_ids: List[str] = Field([])


class Inspiration(BaseModel):
    id: str = Field(...)
    content: str = Field(...)
    files: List[FileInfo] = Field([])
    tags: List[str] = Field([])
    create_time: int = Field(None)
    update_time: Optional[int] = Field(None)
