import asyncio
import aiohttp
import json

class KateWalletService :
    def __init__(self):
        self._from_json = json.loads
        self.__session: aiohttp.ClientSession = None
        self.isLogged = False
        self.isLive = True
        self.socialName = 'telegram'
        self.host = ''
        self.port = ''
        self.url = self.host + self.port 
        self.headers = {
            "authorization":"",
            "Content-Type":"application/json"
        }
       

    async def login(self)-> None:
        if not self.isLogged:
            self.__session = aiohttp.ClientSession()
            self.isLogged = True
            
    async def logout(self)-> None:
        if self.isLogged:
            await self.__session.close()
            self.isLogged = False 

    async def json_or_text(self, response: aiohttp.ClientResponse):
        text = await response.text(encoding='utf-8')

        try:
            if response.headers['content-type'] == 'application/json;charset=utf-8' or response.headers['content-type'] == 'application/json':
                return self._from_json(text)
            else:
                try:
                    data = self._from_json(text)
                    return data
                except:
                    pass
        except KeyError:
            
            try:
                
                return self._from_json(text)
            except : 
                pass
        
        return text


    async def check_exist(self, socialId):

        await self.login()
        path = self.url + "/wallet/deposit/"
        
        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        }

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    if len(data) == 0:
                        return False
                    else:
                        return True

        except Exception as e:
            print(f'Something wrong when checking existance : {e}')
            await self.check_exist(socialId)
        
        await self.logout()

    async def create_wallet(self, socialId):
        await self.login()
        path = self.url + "/wallet/create/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        }

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                        return data
                else:
                    return False
                    
        except Exception as e:
            print(f'Something wrong when create wallet: {e}')
            #await self.check_exist(socialId)
        
        await self.logout()

    async def get_balance(self, socialId):
        await self.login()
        path = self.url + "/wallet/balance/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        }

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                        return data
                else:
                    return False
                    
        except Exception as e:
            print(f'Something wrong when getting balance : {e}')
            await self.check_exist(socialId)
        
        await self.logout()

    async def deposit(self, socialId):
        await self.login()
        path = self.url + "/wallet/deposit/"
        
        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        }

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            await self.deposit(socialId)
        
        await self.logout()

    async def backup(self, socialId):
        await self.login()
        path = self.url + "/wallet/backup/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        } 

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def stake(self, socialId, amount, validator_address):
        await self.login()

        path = self.url + "/earn/stake/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName,
            "validatorAddress" : validator_address,
            "amount": amount
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()
    
    async def withdraw(self, socialId, amount, denom, to_address):
        await self.login()
        path = self.url + "/wallet/send/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName,
            "to_address": to_address,
            "amount": amount,
            "denom": denom
        }

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def profile(self, socialId):
        await self.login()
        path = self.url + "/chain/delegation/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName
        } 

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def unstake(self, socialId, amount, validator_address):
        await self.login()

        path = self.url + "/earn/unstake/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName,
            "validatorAddress" : validator_address,
            "amount": amount
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()


    async def claim_reward(self, socialId, validator_address):
        await self.login()

        path = self.url + "/earn/claim/"

        body = {
            "socialId": str(socialId),
            "socialName": self.socialName,
            "validatorAddress" : validator_address
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def get_price(self, feedId):
        await self.login()
        path = self.url + "/pyth/price/"

        body = {
            "socialName": self.socialName,
            "priceFeedId" : feedId
        } 

        try:
            async with self.__session.request('GET', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def set_price_alert(self, socialId, asset):
        await self.login()
        path = self.url + "/pyth/alert/"

        body = {
            "socialId": socialId,
            "priceFeedId" : asset
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def get_price_alert(self, socialId):
        await self.login()
        path = self.url + "/pyth/alert/exist/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def remove_price_alert(self, socialId, asset):
        await self.login()
        path = self.url + "/pyth/alert/remove/"

        body = {
            "socialId": socialId,
            "priceFeedId" : asset
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()



    async def set_price_change_alert(self, socialId, asset, change):
        await self.login()
        path = self.url + "/pyth/alert/change/"

        body = {
            "socialId" : str(socialId),
            "socialName": self.socialName,
            "change": change,
            "asset" : asset
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def get_vote_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/vote/exist/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def get_proposal_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/proposal/exist/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def set_vote_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/vote/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def set_proposal_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/proposal/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def remove_vote_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/vote/remove/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()

    async def remove_proposal_alert(self, socialId):
        await self.login()
        path = self.url + "/alert/proposal/remove/"

        body = {
            "socialId": socialId
        } 

        try:
            async with self.__session.request('POST', path, data=json.dumps(body), headers=self.headers) as response:
                data = await self.json_or_text(response)
                print(data)
                await self.logout()
                if response.status == 200:
                    return data

        except Exception as e:
            print(f'Something wrong when getting deposit wallet : {e}')
            #await self.backup(socialId)
        
        await self.logout()


            