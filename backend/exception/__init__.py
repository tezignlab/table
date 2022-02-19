from enum import Enum


class HTTPExceptionEnum(tuple, Enum):
    AUTH_FAILED = (401, 'Auth Failed')
    NOT_FOUND = (404, 'Not found')
    USER_NOT_FOUND = (101000, 'User not found')
    INVALID_USERNAME_PASSWORD = (101001, 'Invalid username password')
    INVALID_ACTIVATE_CODE = (101002, 'Invalid activate code')
    EMAIL_HAS_BEEN_REGISTERED = (101003, 'Email has been registered')
    WRONG_OLD_PASSWORD = (101004, 'Wrong old password')
    CODE_NOT_MATCH = (101005, 'Code not match')
    USERNAME_HAS_BEEN_REGISTERED = (101006, 'Username has been registered')


class HTTPBaseException(Exception):
    def __init__(self, exc: HTTPExceptionEnum):
        Exception.__init__(self)
        self.code = exc[0]
        self.message = exc[1]
