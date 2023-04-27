import fetch from "node-fetch"
import { InjNotification, InjAddressNotif, readInjAddress, readEthAddress, readInjAddressNotification, readEthAddressNotification, saveEthAddress, saveEthAddressNotification, saveInjAddressNotification, saveInjAddress} from '../explorer/manager/utils'

interface NewWalletParams {
    socialId : string,
    socialName : string,
    ethAddress : string,
    injAddress : string,
    mnemonic : any,
    privateKey : string
}

interface WalletInfo{
    ethAddress: string,
    injAddress: string,
    privateKey : string,
    mnemonic : string
}

export interface Registration{
    add_wallet : boolean,
    exist : boolean
}
export class DataService {
    /**
     * 
     */
    private url : string
    constructor(){
        let host = ""
        let port = ""
        this.url = host + port

    }
    public async registerNewUser(data : NewWalletParams) : Promise<Registration>{
        let headers = {
            "Content-Type":"application/json"

        }

        let mapNotification : InjAddressNotif = {
            telegramId : '',
            discordId : '',
            telegramNotif : false,
            discordNotif : false
        }

       
        
        let discord = '0'
        let telegram = '0'
        if(data.socialName === "discord"){

            discord = data.socialId
            mapNotification.discordId = data.socialId
            mapNotification.discordNotif = true

        }else{
            telegram  = data.socialId
            mapNotification.telegramId = data.socialId
            mapNotification.telegramNotif = true
        }

        let body = {
            "first_social_name" : data.socialName, 
            "privateKey" : data.privateKey, 
            "mnemonic": data.mnemonic, 
            "inj_address": data.injAddress, 
            "eth_address": data.ethAddress,
            "telegram_id": telegram,
            "discord_id" : discord
        }


        let response = await fetch(
            this.url + '/base/new/', 
            {method: 'POST', 
            body: JSON.stringify(body), 
            headers: headers})

        let injCreated  = readInjAddress()
        if(!injCreated){
            let injCreated : string[] = []
            injCreated.push(data.injAddress)
            saveInjAddress(injCreated)
        }else{
            injCreated.push(data.injAddress)
            saveInjAddress(injCreated)
        }
        let ethCreated  = readEthAddress()
        if(!ethCreated){
            let ethCreated : string[] = []
            ethCreated.push(data.ethAddress)
            saveEthAddress(ethCreated)
        }else{
            ethCreated.push(data.ethAddress)
            saveEthAddress(ethCreated)
        }

        let injNotification  = readInjAddressNotification()!
        let ethNotification = readEthAddressNotification()!

        if(!injNotification){

            let injNotification : InjNotification = new Map()
            injNotification.set(data.injAddress, mapNotification)
            saveInjAddressNotification(injNotification)
            
        }else{
            let injNotificationMap = new Map(Object.entries(injNotification))
            injNotificationMap.set(data.injAddress, mapNotification)
            saveInjAddressNotification(injNotificationMap)
        }

        if(!ethNotification){
            let ethNotification : InjNotification = new Map()
            ethNotification.set(data.ethAddress, mapNotification)
            saveEthAddressNotification(ethNotification)
        }else{
            let ethNotificationMap =  new Map(Object.entries(ethNotification))
            ethNotificationMap.set(data.ethAddress, mapNotification)
            saveEthAddressNotification(ethNotificationMap)
        }
        
        

        
        return await this.dataManager(response)
    }

    public async getReceiveAddress(socialId : string, socialName : string) : Promise<string>{
        return (await this.getWallet(socialId, socialName)).injAddress
    }

    public async getWallet(socialId : string, socialName : string): Promise<WalletInfo>{

        let headers = {}

        let query = "/" + socialId + "/" + socialName

        let response = await fetch(
            this.url + '/base/details' + query, 
            {method: 'GET', 
            headers: headers})

        return await this.dataManager(response)
    }

    private async dataManager(response: any): Promise<string | any>{
        let dataText: string = await response.text()
        if (response.headers.get('Content-Type') === 'application/json' || response.headers.get('content-type') === 'application/json;charset=utf-8'){
            try{
                let dataJson : any =  JSON.parse(dataText)
                return dataJson
            }catch(error){
                console.log('Json Parse Error Occurred : '+error)
                //this.data = await response.text()
                
                
            }
        }else{
            return dataText
        }
    }
}