from database.connection import Connection, psycopg2

class ExistWallet:
    
    def __init__(self, connector : Connection, socialId, socialName):
        self.__database = connector
        self.__socialId = socialId
        self.__socialName = socialName
        
    
    def run(self)-> bool:
        
        try:
            cursor = self.__database.get_connection().cursor()
            query = self.get_query(self.__socialName).format(self.__socialId)
            cursor.execute(query)
            data = cursor.fetchall()
            if len(data) == 0:
                return False
            else:
                return True
        except (Exception, psycopg2.Error) as e:
            print("",e)
        finally:
            
            if (self.__database.get_connection()):
                cursor.close()
                #self.connection.close()

    def get_query(self, socialName) -> str:
        if socialName == "discord":
            return "SELECT * FROM wallet WHERE discord_id = '{0}'"
        else:
            return "SELECT * FROM wallet WHERE telegram_id = '{0}'"

