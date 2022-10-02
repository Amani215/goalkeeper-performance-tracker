import redis
import os

redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT")

redis_db = redis.Redis(host=redis_host, port=int(redis_port), db=0)
