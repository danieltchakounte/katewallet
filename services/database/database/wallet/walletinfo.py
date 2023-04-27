from database.connection import Connection, psycopg2
from manager.brain import Brain

class WalletInfo:

    def __init__(self, connector : Connection, socialId, socialName):
        self.__database = connector
        self.__socialId = socialId
        self.__socialName = socialName
        
    
    def run(self) -> tuple:
        
        try:
            cursor = self.__database.get_connection().cursor()
            query = self.get_query(self.__socialName).format(self.__socialId)
            cursor.execute(query)
            data = cursor.fetchall()[0]

            return self.treat_data(data)
        except (Exception, psycopg2.Error) as e:
            print("something went wrong when getting wallet info ",e)
        finally:
            
            if (self.__database.get_connection()):
                cursor.close()
                #self.connection.close()

    def get_query(self, socialName) -> str:
        if socialName == "discord":
            return "SELECT inj_address, eth_address, privatekey, mnemonic FROM wallet WHERE discord_id = '{0}'"
        else:
            return "SELECT inj_address, eth_address, privatekey, mnemonic FROM wallet WHERE telegram_id = '{0}'"
        
    def treat_data(self, data):

        

        inj_address = data[0]
        eth_address = data[1]
        privateKey = data[2]
        mnemonic = data[3]


        body = {
            "wallet_exist" : True,
            "injAddress" : inj_address,
            "ethAddress" : eth_address,
            "privateKey" : Brain.decrypt(bytes.fromhex(privateKey)),
            "mnemonic" : Brain.decrypt(bytes.fromhex(mnemonic))
        }
        
        return body