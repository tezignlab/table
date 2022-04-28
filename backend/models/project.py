from typing import Optional, List

from pydantic import BaseModel, Field

from models import OkOrNot
from models.user import User



class CollectionBody(BaseModel):
    name: str = Field(...)
    desc: Optional[str] = Field('')


class Collection(BaseModel):
    id: str
    name: str = Field(...)
    desc: str = Field('')
    covers: List[str] = Field([])
    create_time: int = Field(...)


class UserCollection(Collection):
    user: User


class CollectCollection(Collection):
    is_collect: bool = Field(False)


class Author(BaseModel):
    home: str = Field(...)
    name: str = Field(...)
    avatar: str = Field(...)


class BaseProject(BaseModel):
    id: str
    user_id: Optional[str] = Field(None)
    author: Author
    origin: str = Field(...)
    origin_url: Optional[str] = Field(None)
    title: str = Field(...)
    cover: str = Field('https://ai.tezign.com/static/naodong/cover.jpeg')
    tags: List[str] = Field([])
    publish_time: int = Field(...)
    count_read: int = Field(0)
    count_like: int = Field(0)
    is_like: bool = Field(False)
    is_collect: bool = Field(False)
    collections: List[CollectCollection] = Field([])


class Project(BaseProject):
    content: str = Field(...)


class LikesBody(BaseModel):
    project_id: str = Field(...)
    type: OkOrNot
