import os

from celery import Celery


def _get_env(name: str, default: str) -> str:
    value = os.getenv(name)
    return value if value else default


celery_app = Celery(
    "terraweave",
    broker=_get_env("REDIS_URL", "redis://redis:6379/0"),
    backend=_get_env("REDIS_URL", "redis://redis:6379/0"),
)


@celery_app.task
def ping() -> str:
    return "pong"
