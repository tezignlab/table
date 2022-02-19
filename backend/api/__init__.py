from typing import Optional

from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from passlib.context import CryptContext
from exception import HTTPBaseException, HTTPExceptionEnum

from config import conf
from utils import TimeUtils

router_public = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")
crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SECRET_KEY = conf['user']['pwd']['secret_key']
ALGORITHM = conf['user']['pwd']['algorithm']


async def current_user_id(token: str = Depends(oauth2_scheme)):
    """
    Get userId from http header `Authorization`, usage for `Depends`:

    @app.get("/user")
    async def user(user_id: UserInDB = Depends(current_user_id)):
        ...
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None or payload.get('expire') < TimeUtils.now_timestamp():
            raise HTTPBaseException(HTTPExceptionEnum.AUTH_FAILED)
    except JWTError:
        raise HTTPBaseException(HTTPExceptionEnum.AUTH_FAILED)
    return user_id


async def optional_user_id(request: Request) -> Optional[str]:
    """
    Get userId from http header `Authorization`, usage:

    @app.get("/user")
    async def user(request: Request):
        user_id = await optional_user_id(request)
        ...
    """
    authorization: str = request.headers.get("Authorization")
    scheme, param = get_authorization_scheme_param(authorization)
    if not authorization or scheme.lower() != "bearer":
        return None
    try:
        payload = jwt.decode(param, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("id")
    except JWTError:
        return None


__all__ = ['router_public', 'user', 'project', 'help', 'file', 'download', 'inspiration',
           'current_user_id', 'optional_user_id', 'crypt_context', 'SECRET_KEY', 'ALGORITHM']
