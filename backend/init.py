import os
import json
from db import mongo, es
from config import conf


lang = os.getenv('DATA_LANG', 'en')
es_index = conf['elasticsearch']['index']

# Clear old data
es.indices.delete(index=es_index, ignore=[400, 404])
mongo.table.project.delete_many({})


# Write data to DB
with open(f'{os.path.dirname(__file__)}/data/mongo_projects_{lang}.json', 'r') as f:
    projects = json.load(f)
    mongo.table.project.insert_many(projects)
    for project in projects:
        es.index(index=es_index,
                 id=str(project['_id']),
                 document={
                     'title': project['title'],
                     'tags': project['tags'],
                     'origin': project['origin'],
                     'content': project['content'],
                     'author': project['author']
                 })
