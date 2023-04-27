from database.connection import Connection
import json
from .queries import Queries
from .brain import Brain


class Manager:

    def __init__(self):
        
        self.database = Connection()

    def on_data(self, query, body) -> None:
        
        try:
            json_body = json.loads(body)
        except:
            json_body = body
        
        if query in Queries().config().keys():
            respond = Queries().config()[query].parameter(self.database, body)
            return respond
        else:
            return ""
        
