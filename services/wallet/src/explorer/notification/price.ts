import {readHighLow} from "../manager/utils"
import {HOST, TELEGRAMPORT, DISCORDPORT, HEADERS} from '../index'
import fetch from "node-fetch"

export class PriceNotify{
    /**
     * 
     */

    constructor(private feedId : string, private price: number, private direction : string){
        this.feedId = feedId
        this.price = price
        this.direction = direction
        this.treatPrice()
    }

    private async treatPrice(){
        let priceNotification = readHighLow()
        if(priceNotification){
            let priceNotificationMap = new Map<string, any>(Object.entries(priceNotification))
            let high_low = priceNotificationMap.get(this.feedId)
            if(high_low){
        
                let asset = new Map()
                let assetData = new Map()
                assetData.set('id', high_low)
                assetData.set('direction', this.direction)
                assetData.set('price', this.price)
                assetData.set('feedId', this.feedId)
                console.log(assetData)
                    //asset.set(this.feedId, new Map(JSON.parse(JSON.stringify(Object.entries(Object.entries(assetData))))))
                await this.sentToTelegram(assetData)
                
            }
        }
    }

    private async  sentToTelegram(data : any){
        console.log('sending to telegram......')
        console.log(data)
        let response = await fetch(
            HOST + TELEGRAMPORT + '/notify/price/', 
            {method: 'POST', 
            body: JSON.stringify(Object.fromEntries(data)), 
            headers: HEADERS})
    }
}