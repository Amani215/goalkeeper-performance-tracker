import redis
import os

redis_host = os.getenv("REDIS_HOST")
redis_port:int = os.getenv("REDIS_PORT")

redis_db = redis.Redis(host=redis_host, port=redis_port, db=0)
