import {readNewVote} from '../manager/utils'
import { HOST, TELEGRAMPORT, DISCORDPORT, HEADERS} from '../index'
import fetch from "node-fetch"

export interface VoteData{
    voter : string,
    proposalId : string,
    option : string,
    hash : string
}
interface VoteToSent{
    voter: string,
    proposalId: string,
    hash : string,
    option : string,
    id : any
}

export class VoteNotify{
    /**
     * 
     */
    constructor(private data : VoteData){
        this.data = data
        this.treatVote()
    }

    private treatVote(){
        let voteNotification = readNewVote()
        if(voteNotification){
            let voteNotificationMap = new Map<string, any>(Object.entries(voteNotification))
            this.sentToTelegram(voteNotificationMap.get('telegram'))
            //this.sentToDiscord(voteNotification.get('discordId'))
        }
        
    }

    private async sentToTelegram(idList : any){

        let data : VoteToSent = {
            voter : this.data.voter,
            proposalId : this.data.proposalId,
            hash: this.data.hash,
            option : this.data.option,
            id : idList
        }

        let response = await fetch(
            HOST + TELEGRAMPORT + '/notify/vote/', 
            {method: 'POST', 
            body: JSON.stringify(data), 
            headers: HEADERS})
    }

    /**private async sentToDiscord(id : any){

        let data : VoteToSent = {
            title : this.data.title,
            description : this.data.description,
            hash: this.data.hash,
            id
        }

        let response = await fetch(
            HOST + DISCORDPORT + '/notify/vote/', 
            {method: 'POST', 
            body: JSON.stringify(data), 
            headers: HEADERS})
    }*/
}