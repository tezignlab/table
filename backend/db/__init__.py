from config import conf
from pymongo import MongoClient
from elasticsearch import Elasticsearch

# Mongo
mongo = MongoClient(**conf['mongo'])

# Elasticsearch
es = Elasticsearch(**conf['elasticsearch'])
