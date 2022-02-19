class ESService:

    @staticmethod
    def project_search_query(keyword: str, skip: int, limit: int):
        return {
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "author.name": {
                                    "query": keyword,
                                    "boost": 7
                                }
                            }
                        },
                        {
                            "match": {
                                "title": {
                                    "query": keyword,
                                    "boost": 7
                                }
                            }
                        },
                        {
                            "match": {
                                "tags.raw": {
                                    "query": keyword,
                                    "boost": 3
                                }
                            }
                        },
                        {
                            "match": {
                                "content": {
                                    "query": keyword,
                                    "boost": 1
                                }
                            }
                        }
                    ]
                }
            },
            "size": limit,
            "from": skip
        }
