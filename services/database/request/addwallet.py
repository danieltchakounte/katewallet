from database.connection import Connection
from database.wallet.setNewWallet import SetNewWallet
from database.wallet.existwallet import ExistWallet
from manager.brain import Brain


try:
    import bcrypt
except:
    import os
    os.system("pip3 install bcrypt")
    import bcrypt


class AddWallet:

    def __init__(self, 
                 connector : Connection, 
                 first_social_name, 
                 privateKey, 
                 mnemonic, 
                 inj_address, 
                 eth_address, 
                 telegram_id, 
                 discord_id):
        
        self.__connector = connector
        self.__first_social_name = first_social_name
        self.__private_key = privateKey
        self.__mnemonic = mnemonic['phrase']
        self.__inj_address = inj_address
        self.__eth_address = eth_address
        self.__telegram_id = telegram_id
        self.__discord_id = discord_id
        

    def run(self) -> dict:
        print('run add')

        socialId = ""
        if self.__first_social_name == 'telegram':
            socialId = self.__telegram_id
        else:
            socialId = self.__discord_id

        user_exist = ExistWallet(self.__connector, socialId, self.__first_social_name).run()
        if not user_exist:
            
            encrypted_private_key = Brain.encrypt(self.__private_key)
            
            encrypted_mnemonic = Brain.encrypt(self.__mnemonic)
            #.decode('ISO-8859-1'),
            new = SetNewWallet(self.__connector, 
                               self.__first_social_name, 
                               encrypted_private_key.hex(),  
                               encrypted_mnemonic.hex(), 
                               self.__inj_address, 
                               self.__eth_address, 
                               self.__telegram_id,
                               self.__discord_id).run()
            if new:
                data = {}
                data['add_wallet'] = True
                data['exist'] = False
                return data
            else:
                data = {}
                data['add_wallet'] = False
                data['exist'] = False
                return data
        else:
            data = {}
            data['add_wallet'] = False
            data['exist'] = True
            return data

    @staticmethod
    def parameter(connector : Connection, data):
        if len(data) != 7:
             print("error on add wallet parameter : ", data)
        else:
            #try:
            return AddWallet(connector, 
                                 data["first_social_name"], 
                                 data["privateKey"], 
                                 data["mnemonic"], 
                                 data["inj_address"], 
                                 data["eth_address"], 
                                 data["telegram_id"], 
                                 data["discord_id"]).run()
            #except Exception as e:
            #    print("error on add wallet query with error : ",e," data : ",data)