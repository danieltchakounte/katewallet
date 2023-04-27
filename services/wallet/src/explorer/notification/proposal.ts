import {readNewProposal} from '../manager/utils'
import { HOST, TELEGRAMPORT, DISCORDPORT, HEADERS} from '../index'
import fetch from "node-fetch"
import { Console } from 'console'

export interface ProposalData{
    title : string,
    description : string,
    hash : string
}
interface ProposalToSent{
    title: string,
    description: string,
    hash : string,
    id : any
}

export class ProposalNotify{
    /**
     * 
     */
    constructor(private data : ProposalData){
        this.data = data
        this.treatProposal()
    }

    private treatProposal(){
        let proposalNotification =readNewProposal()
        if(proposalNotification){
            let proposalNotificationMap = new Map<string, any>(Object.entries(proposalNotification))
            this.sentToTelegram(proposalNotificationMap.get('telegram'))
            //this.sentToDiscord(proposalNotification.get('discordId'))
        }
        
    }

    private async sentToTelegram(idList : any){
        console.log(idList)
        let data : ProposalToSent = {
            title : this.data.title,
            description : this.data.description,
            hash: this.data.hash,
            id : idList
        }
        console.log(data)

        let response = await fetch(
            HOST + TELEGRAMPORT + '/notify/proposal/', 
            {method: 'POST', 
            body: JSON.stringify(data), 
            headers: HEADERS})
    }

    /**private async sentToDiscord(id : any){

        let data : ProposalToSent = {
            title : this.data.title,
            description : this.data.description,
            hash: this.data.hash,
            id
        }

        let response = await fetch(
            HOST + DISCORDPORT + '/notify/proposal/', 
            {method: 'POST', 
            body: JSON.stringify(data), 
            headers: HEADERS})
    }*/
}