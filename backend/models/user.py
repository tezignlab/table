from enum import Enum, IntEnum
from typing import Optional, Dict

from pydantic import BaseModel, Field


class UserStatusEnum(IntEnum):
    DIED = 0
    ACTIVE = 1
    TO_BE_ACTIVE = 2
    LOCKED = 3
    FORBIDDEN = 4


class PasswordUpdateTypeEnum(IntEnum):
    OLD_PASSWORD = 1
    AUTHORIZATION_CODE = 2


class BlackUserTypeEnum(str, Enum):
    INNER = 'inner'
    OUTER = 'outer'


class RegisterBody(BaseModel):
    username: str = Field(...)
    email: str = Field(...)
    password: str = Field(...)


class UserAuthedToken(BaseModel):
    token_type: str = Field('bearer')
    access_token: str
    expire: int


class PasswordUpdateBody(BaseModel):
    old_password: str = Field(...)
    new_password: str = Field(...)


class UserInfoBody(BaseModel):
    nickname: Optional[str] = Field(None)
    avatar: Optional[str] = Field(None)
    location: Optional[str] = Field(None)
    bio: Optional[str] = Field(None)


class BlackUserBody(BaseModel):
    type: BlackUserTypeEnum = Field(BlackUserTypeEnum.OUTER)
    value: str = Field(...)
    extra: Optional[Dict] = Field(None)


class User(BaseModel):
    id: str
    username: str = Field(...)
    nickname: str = Field(...)
    email: Optional[str] = Field(None)
    avatar: str = Field(...)
    location: Optional[str] = Field(None)
    bio: Optional[str] = Field(None)


class UserInDB(User):
    hashed_password: str
    status: UserStatusEnum = Field(...)
