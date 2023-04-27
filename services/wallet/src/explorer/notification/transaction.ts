import {readInjAddressNotification} from '../manager/utils'
import {HOST, TELEGRAMPORT, DISCORDPORT, HEADERS} from '../index'
import fetch from "node-fetch"

export interface TransactionData{
    from_address : string,
    to_address : string,
    denom : string,
    amount : string
    hash: string
}

type TransactionNotify = Map<string, any>
    /**  : string,
    deposit : boolean,
    amount : string,
    hash : string
}*/

export class InjTransactionNotify{
    /**
     * 
     */

     constructor(private data : TransactionData){
        this.data = data
        this.treatTransaction()
    }

    private async treatTransaction(){
        console.log('treating notification')
        let injAddressNotification = readInjAddressNotification()!
        if(injAddressNotification){
            let injAddressNotificationMap = new Map(Object.entries(injAddressNotification))
            injAddressNotificationMap.get
            if (injAddressNotificationMap.has(this.data.to_address)){
                
                let notifData : TransactionNotify = new Map()
                    notifData.set('denom', this.data.denom)
                    notifData.set('deposit', true)
                    notifData.set('amount', this.data.amount)
                    notifData.set('hash', this.data.hash)
                
                let injData = new Map(Object.entries(injAddressNotificationMap.get(this.data.to_address)))
                if (injData.get('telegramNotif')){
                    let notif : Map<any, TransactionNotify> = new Map()
                    notif.set(injData.get('telegramId'), JSON.parse(JSON.stringify(Object.fromEntries(notifData))))
                    await this.sentToTelegram(notif)
                }else if (injData.get('discordNotif')){
                    let notif : Map<any, TransactionNotify> = new Map()
                    notif.set(injData.get('discordId'), JSON.parse(JSON.stringify(Object.fromEntries(notifData))))
                    await this.sentToDiscord(notif)
                }
            } 
            
            if (injAddressNotificationMap.has(this.data.from_address)){

                let notifData : TransactionNotify = new Map()
                    notifData.set('denom', this.data.denom)
                    notifData.set('deposit', false)
                    notifData.set('amount', this.data.amount)
                    notifData.set('hash', this.data.hash)
                
                let injData = new Map(Object.entries(injAddressNotificationMap.get(this.data.from_address)))
                if (injData.get('telegramNotif')){
                    let notif : Map<any, TransactionNotify> = new Map()
                    notif.set(injData.get('telegramId'), JSON.parse(JSON.stringify(Object.fromEntries(notifData))))
                    await this.sentToTelegram(notif)
                }else if (injData.get('discordNotif')){
                    let notif : Map<any, TransactionNotify> = new Map()
                    notif.set(injData.get('discordId'), JSON.parse(JSON.stringify(Object.fromEntries(notifData))))
                    await this.sentToDiscord(notif)
                }
            }
        }

    }

    private async sentToTelegram(data : any){
        console.log('sending to telegram......')
        let response = await fetch(
            HOST + TELEGRAMPORT + '/notify/transaction/', 
            {method: 'POST', 
            body: JSON.stringify(Object.fromEntries(data)), 
            headers: HEADERS})

    }

    private async sentToDiscord(data : any){

        let response = await fetch(
            HOST + DISCORDPORT + '/notify/transaction/', 
            {method: 'POST', 
            body: JSON.stringify(Object.fromEntries(data)), 
            headers: HEADERS})
    }
}