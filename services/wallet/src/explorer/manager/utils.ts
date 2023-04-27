import * as fs from 'fs'
interface MessageType{
    send : string,
    proposal : string,
    vote : string 

}
export interface InjAddressNotif{
    telegramId: string,
    discordId: string,
    telegramNotif : boolean,
    discordNotif : boolean
}
export type InjNotification = Map<string, InjAddressNotif>
  
export interface Proposal{
    telegramId : [],
    discordId : []
}
export interface PriceData{
    high_low : [],
    change : []
}
type PriceNotification = Map<string, PriceData>
 

export let MESSAGE_TAKING_IN_CHARGE : MessageType = {
    send : "/cosmos.bank.v1beta1.MsgSend",
    proposal : "/cosmos.gov.v1beta1.MsgSubmitProposal", //'   /cosmos.gov.v1beta1.TextProposal
    vote : "/cosmos.gov.v1beta1.MsgVote"
}

export function readHighLow(){
    try{
        let high_low = fs.readFileSync('high_low.json', 'utf8')
        return JSON.parse(high_low)
    }catch(err){
        return false
    }
}

export function saveHighLow(data : any){
    console.log(data)
    fs.writeFileSync('high_low.json', JSON.stringify(Object.fromEntries(data)))
    return true
}

export function readInjAddress(){
    try {

        let injAddress = fs.readFileSync('inj_address.json', 'utf8')
        try{
            let injJson : string[] = JSON.parse(injAddress)
            return injJson
        }catch(err){
            return false
        }
        
    } catch(err){
        return false
    }
}

export function saveInjAddress(data : string[]){
    console.log(data)
    fs.writeFileSync('inj_address.json', JSON.stringify(data))
    return true
}

export function readEthAddress(){
    try{
        let ethAddress = fs.readFileSync('eth_address.json', 'utf8')
        try{
            let ethJson : string[] = JSON.parse(ethAddress)
            return ethJson
        }catch(err){
            return false
        }
    } catch(err){
        return false
    }
}

export function saveEthAddress(data : string[]){
    console.log(data)
    fs.writeFileSync('eth_address.json', JSON.stringify(data))
    return true
}

export function readInjAddressNotification(){
    try{
        console.log('read inj notification')
        let injAddress  = fs.readFileSync('inj_address_notification.json', 'utf8')
        let injJson : InjNotification = JSON.parse(injAddress)
        return injJson
    } catch(err){
        if(!fs.existsSync('inj_address_notification.json')){
            return false
        }
    }
}

export function saveEthAddressNotification(data : InjNotification){
    console.log(data)
    fs.writeFileSync('eth_address_notification.json', JSON.stringify(Object.fromEntries(data)))
    return true
}

export function readEthAddressNotification(){
    try{
        let ethAddress = fs.readFileSync('eth_address_notification.json', 'utf8')
        let ethJson : InjNotification = JSON.parse(ethAddress)
        return ethJson
    } catch(err){
        if(!fs.existsSync('eth_address_notification.json')){
            return false
        }
    }
}

export function saveInjAddressNotification(data : InjNotification){
    console.log(data)
    fs.writeFileSync('inj_address_notification.json', JSON.stringify(Object.fromEntries(data)))
    return true
}

export function readNewProposal(){
    try{
        let proposal = fs.readFileSync('new_proposal_notification.json', 'utf8')
        return JSON.parse(proposal)
    } catch(err){
        if(!fs.existsSync('new_proposal_notification.json')){
            return false
        }
    }
}

export function saveNewProposal(data : any){
    fs.writeFileSync('new_proposal_notification.json', JSON.stringify(data))
    return true
}

export function readPriceNotification(feedId : string){
    try{
        let price = fs.readFileSync(`${feedId}_price_notification.json`, 'utf8')
        return JSON.parse(price)
    } catch(err){
        if(!fs.existsSync(`${feedId}_price_notification.json`)){
            return false
        }
    }
}

export function savePriceNotification(feedId : string, data : any){
    fs.writeFileSync(`${feedId}_price_notification.json`, JSON.stringify(Object.fromEntries(data)))
    return true
}

export function readNewVote(){
    try{
        let vote = fs.readFileSync('new_vote_notification.json', 'utf8')
        return JSON.parse(vote)
    } catch(err){
        if(!fs.existsSync('new_vote_notification.json')){
            return false
        }
    }
}

export function saveNewVote(data : any){
    fs.writeFileSync('new_vote_notification.json', JSON.stringify(data))
    return true
}