import os
import yaml
from functools import wraps
import logging


def replace_with_env(d: dict, prefix: str):
    for k, v in d.items():
        env = f'{prefix}{k.upper()}'
        if isinstance(v, dict):
            replace_with_env(v, f'{env}_')
        else:
            if os.getenv(env):
                d[k] = yaml.safe_load(os.getenv(env))


def WithEnvConfig(prefix: str = ''):
    """
    Replace the configuration with system environment variables

    Args:
        prefix (str, optional): system environment variables prefix. Defaults to ''.
    """

    def env_config_wrapper(func):
        @wraps(func)
        def load_env_config(*args, **kwargs):
            conf = func(*args, **kwargs)
            if type(conf) is dict:
                replace_with_env(conf, prefix)
            else:
                logging.warning(f'Config type should be dict, but got {type(conf)}')
            return conf

        return load_env_config

    return env_config_wrapper


@WithEnvConfig(prefix='')
def load_config():
    return yaml.safe_load(open(f'{os.path.dirname(os.path.abspath(__file__))}/application.yml'))


conf = load_config()
