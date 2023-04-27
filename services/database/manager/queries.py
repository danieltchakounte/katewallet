from request.walletdetails import WalletDetails
from request.addwallet import AddWallet

class Queries:

    def __init__(self):
        self.__config = {
            "add_wallet":AddWallet,
            "wallet_details":WalletDetails
        }

    def config(self) -> dict:
        return self.__config