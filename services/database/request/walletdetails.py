from database.wallet.existwallet import ExistWallet
from database.wallet.walletinfo import WalletInfo 
from database.connection import Connection

class WalletDetails:

    def __init__(self, connector : Connection, socialId, socialName):
        self.__socialId = socialId
        self.__socialName = socialName
        self.__connector = connector

    def run(self) -> dict:

        user_exist = ExistWallet(self.__connector, self.__socialId, self.__socialName).run()
        
        if user_exist:
           
            
            wallet_data = WalletInfo(self.__connector, self.__socialId, self.__socialName).run()
               
            return wallet_data
        else:
            data = {}
            data["injAddress"] = ""
            data["ethAddress"] = ""
            data["privateKey"] = ""
            data["mnemonic"] = ""
            data['wallet_exist'] = False 
            return data



    @staticmethod
    def parameter(connector : Connection, data):
        
        if len(data)!= 2:
            print("error on sign in parameter : ", data)
        else:
            try:
                return WalletDetails(connector, data["socialId"], data["socialName"]).run()
            except Exception as e:
                print("error on wallet details initialisation with error : ",e)
