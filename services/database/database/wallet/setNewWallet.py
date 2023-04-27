from database.connection import Connection, psycopg2

class SetNewWallet:
    
    def __init__(self, 
                 connector : Connection, 
                 first_social_name, 
                 privateKey, 
                 mnemonic, 
                 inj_address, 
                 eth_address,
                 telegram_id, 
                 discord_id,
                 ):
        self.__database = connector
        self.__first_social_name = first_social_name
        self.__privateKey = privateKey
        self.__mnemonic = mnemonic
        self.__inj_address = inj_address
        self.__eth_address = eth_address
        self.__telegram_id = telegram_id
        self.__discord_id = discord_id
        
    
    def run(self) -> bool:
        
        try:

            cursor = self.__database.get_connection().cursor()
            #cursor.mogrify(
            query = "INSERT INTO wallet (first_social_name, privatekey, mnemonic, inj_address, eth_address, telegram_id, discord_id, premium) VALUES( '%s', '%s', '%s', '%s', '%s' ,'%s', '%s', %s)" % (self.__first_social_name, self.__privateKey, self.__mnemonic, self.__inj_address, self.__eth_address, self.__telegram_id, self.__discord_id, False)
            cursor.execute(query)
            self.__database.get_connection().commit()
            return True
        except (Exception, psycopg2.Error) as e:
            print("Something went wrong when saving new wallet ",e)
            return False
        finally:
            
            if (self.__database.get_connection()):
                cursor.close()


