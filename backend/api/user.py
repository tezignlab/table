from datetime import datetime, timedelta

from bson import ObjectId
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from api import router_public, crypt_context, SECRET_KEY, ALGORITHM, current_user_id
from db import mongo
from exception import *
from fastlab.models import Response
from models.user import *
from utils import TimeUtils
from random import randint

# Mongo Collections
table_user = mongo['table']['user']
table_user_black = mongo['table']['user-black']


def get_user(query: dict):
    return table_user.find_one(query)


def random_avatar():
    return f'/api/static/avatars/{randint(0, 9)}.png'


def create_access_token(data: dict, expires_delta: Optional[timedelta] = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    expire = int(expire.timestamp() * 1000)
    to_encode.update({"expire": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM), expire


async def get_current_user(user_id: str = Depends(current_user_id)):
    user = table_user.find_one({'_id': ObjectId(user_id)})
    if user is None:
        raise HTTPBaseException(HTTPExceptionEnum.USER_NOT_FOUND)
    user['id'] = user_id
    return user


@router_public.post("/api/v1/login", response_model=UserAuthedToken, summary='Sign In', tags=['User'])
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = get_user({'$or': [{'username': form.username}, {'email': form.username}]})
    if not user:
        raise HTTPBaseException(HTTPExceptionEnum.USER_NOT_FOUND)
    if user.get('hashed_password') and crypt_context.verify(form.password, user.get('hashed_password')):
        access_token, expire = create_access_token(data={'id': str(user['_id'])})
        return UserAuthedToken(access_token=access_token, expire=expire).dict()
    raise HTTPBaseException(HTTPExceptionEnum.INVALID_USERNAME_PASSWORD)


@router_public.post("/api/v1/register", response_model=Response, summary='Sign Up', tags=['User'])
async def register(body: RegisterBody):
    user = get_user({'username': body.username})
    if user:
        raise HTTPBaseException(HTTPExceptionEnum.USERNAME_HAS_BEEN_REGISTERED)
    user = get_user({'email': body.email})
    if user:
        raise HTTPBaseException(HTTPExceptionEnum.EMAIL_HAS_BEEN_REGISTERED)
    user = {
        'username': body.username,
        'email': body.email,
        'nickname': body.username,
        'avatar': random_avatar(),
        'hashed_password': crypt_context.hash(body.password),
        'status': UserStatusEnum.ACTIVE
    }
    result = table_user.insert_one(user)
    access_token, expire = create_access_token(data={'id': str(result.inserted_id)})
    return Response(data=UserAuthedToken(access_token=access_token, expire=expire).dict())


@router_public.get("/api/v1/user", response_model=Response[User], summary='Mine info', tags=['User'])
async def user_info(current_user: UserInDB = Depends(get_current_user)):
    return Response(data=current_user)


@router_public.get("/api/v1/user/{username}", response_model=Response[User], summary='User info', tags=['User'])
async def user_info(username: str):
    user = get_user({'username': username})
    if not user:
        raise HTTPBaseException(HTTPExceptionEnum.USER_NOT_FOUND)
    user['id'] = str(user['_id'])
    return Response(data=user)


@router_public.patch("/api/v1/user", response_model=Response, summary='Update info', tags=['User'])
async def update_user_info(body: UserInfoBody, user_id: str = Depends(current_user_id)):
    table_user.update_one({'_id': ObjectId(user_id)}, {'$set': body.dict(exclude_none=True)})
    return Response()


@router_public.patch("/api/v1/user/password", response_model=Response, summary='Update password', tags=['User'])
async def update_user_info(body: PasswordUpdateBody, user_id: str = Depends(current_user_id)):
    user = table_user.find_one({'_id': ObjectId(user_id)})
    if not crypt_context.verify(body.old_password, user.get('hashed_password')):
        raise HTTPBaseException(HTTPExceptionEnum.WRONG_OLD_PASSWORD)
    table_user.update_one({'_id': user['_id']}, {'$set': {'hashed_password': crypt_context.hash(body.new_password)}})
    return Response()


@router_public.post("/api/v1/other/black", response_model=Response, summary='Black user', tags=['User'])
async def black_user(body: BlackUserBody, user_id: str = Depends(current_user_id)):
    doc = body.dict()
    doc.update({
        'user_id': user_id,
        'update_time': TimeUtils.now_timestamp()
    })
    table_user_black.update_one({'user_id': user_id, 'value': body.value, 'type': body.type}, {'$set': doc}, upsert=True)
    return Response()
