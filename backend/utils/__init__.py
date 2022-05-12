import random
import time
import uuid

from config import conf

class UUIDUtils:

    @staticmethod
    def uuid() -> str:
        return str(uuid.uuid4()).replace('-', '')


class RandomUtils:

    @staticmethod
    def number_str(length: int) -> str:
        return str(random.randint(10 ** (length - 1), 10 ** length - 1))


class TimeUtils:

    @staticmethod
    def now_timestamp() -> int:
        return int(time.time() * 1000)

    @staticmethod
    def ymd() -> str:
        return time.strftime('%Y%m%d')


class FileUtils:

    @staticmethod
    def thumbnail(path: str, content_type: str, width: int = 200):
        if content_type.startswith('image') or content_type.startswith('video'):
            return f'{conf["file"]["url_prefix"]}{path.split("backend")[-1]}'
        return ''

    @staticmethod
    def url(path: str):
        return f'{conf["file"]["url_prefix"]}{path.split("backend")[-1]}'
