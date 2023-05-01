import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts"
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import { PYTH_CONTRACT_ADDRESS } from "./utils"
import { readHighLow, readPriceNotification, saveHighLow, savePriceNotification } from "../explorer/manager/utils"

export class Pyth{
    /**
     * 
     */

    private chainGrpcWasmApi : ChainGrpcWasmApi

    constructor(private network : Network){
        this.network = network
        const ENDPOINTS = getNetworkEndpoints(this.network)

        this.chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc)

    }

    public async getPrice(priceFeedId : string): Promise<number | undefined>{
        

        let query = {
            "price_feed": {"id":priceFeedId}
        }

        let base64Query = Buffer.from(JSON.stringify(query)).toString("base64")
        try {
        let response = await this.chainGrpcWasmApi.fetchSmartContractState(
            this.getPythAddress(),
            base64Query
        )

        let data = JSON.parse(Buffer.from(response.data).toString())

        //console.log(data)

        let price = this.priceConverter(data)

        return price
        } catch (error){
            console.log(error)
        }

        

    }

    private priceConverter(data: any): number{

        let price_feed = data.price_feed.price.price
        let exponent = data.price_feed.price.expo

        let price = price_feed * Math.pow(10, exponent)
        return parseFloat(price.toFixed(3))
    }
    private getPythAddress() : string{
        if (this.network === Network.TestnetK8s){
            return PYTH_CONTRACT_ADDRESS.testnet
        }else{
            return PYTH_CONTRACT_ADDRESS.mainnet
        }
    }

    public setPriceAlert(socialId : string, asset : string){
        let notifJson = readHighLow()
        if(notifJson){
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            console.log(notifMap)
            let high_low = notifMap.get(asset)
            console.log(high_low)
            
                //let assetDataMap = new Map<string, any>(Object.entries(assetData))
                //let high_low = assetDataMap.get('high_low')
            if(high_low){
                if (high_low.includes(socialId)){
                    
                    return false
                }else{
                    high_low.push(socialId)
                        //assetDataMap.set('high_low', high_low)
                    notifMap.set(asset, high_low)
                        //notifMap = JSON.parse(JSON.stringify(Object.fromEntries(notifMap)))
                    saveHighLow(notifMap)
                    return true
                }
            }else{
                let high_low : string[] = []
                high_low.push(socialId)
                    //assetDataMap.set('high_low', high_low)
                notifMap.set(asset, high_low)
                    //notifMap = JSON.parse(JSON.stringify(Object.fromEntries(notifMap)))
                saveHighLow(notifMap)
                return true
            }

        
        }else{
            let high_low : string[]= []
            high_low.push(socialId)
            console.log(high_low)
            //let assetData : Map<string, string[]> = new Map()
            //assetData.set('high_low', high_low)
            //console.log(assetData)
            let notifMap : Map<string, string[]> = new Map()
            notifMap.set(asset, high_low)
            //notifMap = JSON.parse(JSON.stringify(Object.fromEntries(notifMap)))
            console.log(notifMap)
            saveHighLow(notifMap)
            return true
        }
    }

    public removePriceAlert(socialId : string, asset : string){
        let notifJson = readHighLow()
        if(notifJson){
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            let high_low = notifMap.get(asset)
            
            if(high_low){
                if (high_low.includes(socialId)){
                    let index = high_low.indexOf(socialId)
                    high_low.splice(index, 1)
                    //assetData.set('high_low', high_low)
                    notifMap.set(asset, high_low)
                    //notifMap = JSON.parse(JSON.stringify(Object.fromEntries(notifMap)))
                    saveHighLow(notifMap)
                    return true
                    
                }else{
                    return false
                }
            }else{
                return false
            }
            
        }else{
            return true
        }
    }

    public getPriceAlert(socialId: string){
        let notifJson = readHighLow()
        if(notifJson){
            let found = false
            let mcontinue = true
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            notifMap.forEach((value : any, key : string) =>{
                if(mcontinue){
                    console.log(value)
                    let high_low = value
                    
                    if(high_low.includes(Number(socialId))){
                        console.log('yes found!')
                        found = true
                        mcontinue = false
                    }
                }
            })

            return found
            
        }else{
            return false}
            
    }

    public showPriceAlert(socialId : string){
        let notifJson = readHighLow()
        let alertList: string[] = []
        if(notifJson){
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            notifMap.forEach((value : any, key : string)=>{
                let high_low = value
                if (high_low){
                    if(high_low.includes(socialId)){
                        alertList.push(key)
                    }
                }
            })
        }

        return JSON.stringify(alertList)
    }

   /**  public setPriceAlertChange(socialId : string, asset : string, change: string){
        let notifJson = readPriceNotification()
        if(notifJson){
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            let assetData = notifMap.get(asset)
            if (assetData){
                let changeData = assetData.get("change")
                if(changeData){
                    let percent = changeData.get(change)
                    if(percent){
                        if (percent.includes(socialId)){
                            return false
                        }else{
                            percent.push(socialId)
                            assetData.set('change', JSON.parse(JSON.stringify(Object.entries(percent))))
                            notifMap.set(asset, JSON.parse(JSON.stringify(Object.entries(assetData))))
                            savePriceNotification(notifMap)
                            return true
                        }
                    }else{
                        let percentData = new Map()
                        let idList = []
                        idList.push(socialId)
                        percentData.set(change, JSON.parse(JSON.stringify(Object.entries(idList))))
                        assetData.set('change', JSON.parse(JSON.stringify(Object.entries(percentData))))
                        notifMap.set(asset, JSON.parse(JSON.stringify(Object.entries(assetData))))
                        savePriceNotification(notifMap)
                        return true

                    }
                }else{
                    let assetData = new Map()
                    let percentData = new Map()
                    let idList = []
                    idList.push(socialId)
                    percentData.set(change, JSON.parse(JSON.stringify(Object.entries(idList))))
                    assetData.set('change', JSON.parse(JSON.stringify(Object.entries(percentData))))
                    notifMap.set(asset, JSON.parse(JSON.stringify(Object.entries(assetData))))
                    savePriceNotification(notifMap)
                    return true
                }
            }else{
                let assetData = new Map()
                let percentData = new Map()
                let idList = []
                idList.push(socialId)
                percentData.set(change, JSON.parse(JSON.stringify(Object.entries(idList))))
                assetData.set('change', JSON.parse(JSON.stringify(Object.entries(percentData))))
                notifMap.set(asset, JSON.parse(JSON.stringify(Object.entries(assetData))))
                savePriceNotification(notifMap)
                return true
            }
        }else{
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            let assetData = new Map()
            let percentData = new Map()
            let idList = []
            idList.push(socialId)
            percentData.set(change, JSON.parse(JSON.stringify(Object.entries(idList))))
            assetData.set('change', JSON.parse(JSON.stringify(Object.entries(percentData))))
            notifMap.set(asset, JSON.parse(JSON.stringify(Object.entries(assetData))))
            savePriceNotification(notifMap)
            return true
        }
    }


    public getPriceAlertChange(socialId: string, asset : string, change : string){
        let notifJson = readPriceNotification()
        if(notifJson){
            let notifMap = new Map<string, any>(Object.entries(notifJson))
            let assetData = notifMap.get(asset)
            if(assetData){
                let changeData = assetData.get('change')
                if (changeData){
                    let percent = changeData.get(change)
                    if(percent){
                        if(percent.includes(socialId)){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }*/
}