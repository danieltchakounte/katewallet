from configuration.config import USER, PASSWORD, DATABASE, HOST, ENCODING
try:
    import psycopg2
except:
    import os
    os.system("pip install psycopg2-binary")
    import psycopg2

class Connection:

    def __init__(self):
        self.__user = USER
        self.__password = PASSWORD
        self.__database = DATABASE 
        self.__host = HOST
        self.__encoding = ENCODING

        self.launch()

    def launch(self):
        self.__connection = psycopg2.connect(
            user=self.__user, 
            password=self.__password, 
            database=self.__database, 
            host=self.__host)
        
        self.__connection.set_client_encoding(self.__encoding)

    def get_connection(self):
        return self.__connection

    def close(self):
        self.__connection.close()
