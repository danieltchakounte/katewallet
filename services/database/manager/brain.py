import json
import rsa
from configuration.config import PUBLICKEY, PRIVATEKEY

class Brain:

    def __init__(self):
        self.count = 0

    def analyse(self, data, client) -> json:
        try:
            print("------ Data received------")
            print(data)
            #on convertit les données en type dictionnaire similaire au json
            data = json.loads(data)
            return data
        except Exception as e:
            #une erreur est survenue alors on retourne au client qu'il y'a eu un problème
            data = {"error":"505 %s" % Brain.error()["505"]}
            client.send(json.dumps(data).encode()) 
            print("Something wrong went converting data to dict : request from with error:",e)
    
    @staticmethod
    def error():
        #on crée les differents type d'erreur qu'on retournera au client
        return {
            "404":"Not Found", 
            "505":"Incorrect Data"
            }
    @staticmethod
    def encrypt(data):
        
        # publicKey, privateKey = rsa.newkeys(512)

        publicKey = rsa.PublicKey.load_pkcs1(PUBLICKEY)

        encrypted = rsa.encrypt(data.encode(),
                            publicKey)
        return encrypted
                        
    @staticmethod
    def decrypt(data):

        privateKey = rsa.PrivateKey.load_pkcs1(PRIVATEKEY)
        decrypted = rsa.decrypt(data, privateKey).decode()

        return decrypted

