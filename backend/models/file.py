from pydantic import Field, BaseModel


class FileInfo(BaseModel):
    id: str = Field(...)
    content_type: str = Field(...)
    url: str = Field(...)
    thumbnail: str = Field(...)
