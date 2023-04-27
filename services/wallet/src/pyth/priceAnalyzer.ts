import {Pyth} from './pyth'
import { readPriceNotification, savePriceNotification,readHighLow, saveHighLow } from '../explorer/manager/utils'
import { Network } from '@injectivelabs/networks'
import { PriceNotify } from "../explorer/notification/price"

export class PriceAnalyzer{
    /**
     * 
     */
    private pyth : Pyth
    constructor(network : Network){
        this.pyth = new Pyth(network)
        
    }

    public highLow(){
        console.log('we gonna check price')
        let assetList = readHighLow()
        console.log(assetList)
        if(assetList){
            assetList = new Map<string, any>(Object.entries(assetList))
            assetList.forEach(async (value : any, key: string) => {
                console.log(key)
                console.log(value)
                let assetPrice = await this.pyth.getPrice(key)
                console.log(assetPrice)
                if(assetPrice){
                    let priceData = readPriceNotification(key)
                    if(priceData){
                        let priceMap = new Map<string, any>(Object.entries(priceData))
                        let high = priceMap.get('high')
                        let low = priceMap.get('low')
                        if (assetPrice > high){
                            console.log('new high')
                            priceMap.set('high', assetPrice)
                            console.log(priceMap)
                            savePriceNotification(key, priceMap)
                            console.log('sending notification')
                            let notification = new PriceNotify(key, assetPrice, 'high')
                        }else if(assetPrice < low){
                            console.log('new low')
                            priceMap.set('low', assetPrice)
                            console.log(priceMap)
                            savePriceNotification(key, priceMap)
                            console.log('sending notification')
                            let notification = new PriceNotify(key, assetPrice, 'low')
                        }
                        
                            
                    }else{
                        let priceMap = new Map()
                            
                        priceMap.set('low', assetPrice)
                        priceMap.set('high', assetPrice)
                            
                        console.log(priceMap)
                        savePriceNotification(key, priceMap)
                        }
                    
                }
            })
        }
    }
}