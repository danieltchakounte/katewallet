import {MESSAGE_TAKING_IN_CHARGE, savePriceNotification} from "./utils"
import {readInjAddress, readNewVote, readNewProposal, saveNewVote, saveNewProposal } from './utils'
import { TransactionData, InjTransactionNotify, ProposalNotify, ProposalData, VoteNotify, VoteData} from '../notification'



export class Manager{
    /**
     * 
     */

    constructor(){

    }
    public transactionAnalyzer(transactions : any){
        let messagesData = JSON.parse(transactions.block.messages)
        messagesData.forEach((data: any) => {
            if (this.typeTakingInCharge().includes(data.type)){
                this.treatTransaction(data, transactions.block.hash)
            }
        })
    }

    private typeTakingInCharge(){
       return Object.values(MESSAGE_TAKING_IN_CHARGE)
    }
    private treatTransaction(transaction : any, hash : string){
        switch (transaction.type) {
            case MESSAGE_TAKING_IN_CHARGE.send:
                this.incomingTransaction(transaction, hash)
                break
            case MESSAGE_TAKING_IN_CHARGE.proposal:
                this.newProposal(transaction, hash)
                break
            case    MESSAGE_TAKING_IN_CHARGE.vote :
                this.newVote(transaction, hash)
                break
            default:
                break
        }

    }

    private  incomingTransaction(data: any, hash : string){
        console.log('incomingTransaction')
        console.log(data)
        console.log(data.value.amount)
        let from_address = data.value.from_address
        let to_address = data.value.to_address
        let available_wallet = readInjAddress()
        if(available_wallet){
            if( available_wallet.includes(from_address) || available_wallet && available_wallet.includes(to_address)){
                let denom = ''
                let amount = ''
                data.value.amount.forEach((element: any) =>{
                    denom = element.denom
                    amount = element.amount
                })

                let transactionData : TransactionData = {
                    from_address,
                    to_address,
                    denom,
                    amount,
                    hash
                }
                console.log('sending transaction notification')
                let notify = new InjTransactionNotify(transactionData)
                
                

                //console.log(data.value)
            }
        }
    }
    private newProposal(data: any, hash : string){
        console.log('proposal')
        console.log(data)
        //let proposalType = ["/cosmos.params.v1beta1.ParameterChangeProposal", "/cosmos.gov.v1beta1.TextProposal"]
        
        let title = data.value.content.title
        let description = data.value.content.description

        let proposalData : ProposalData = {
            title,
            description,
            hash
        }
        let notify = new ProposalNotify(proposalData)
        
        //console.log(`--------Update Orders Function called ----------`)
        //console.log(data.value)
    }
    private newVote(data : any, hash : string){
        console.log('New vote')
        console.log(data)
        let proposalId = data.value.proposal_id
        let voter = data.value.voter
        let voteValue = data.value.option

        let voteData : VoteData = {
            proposalId,
            option : voteValue,
            voter,
            hash
        }

        let notify = new VoteNotify(voteData)

    }

    public setProposal(socialId :string){
        let proposalJson = readNewProposal()
        if(proposalJson){
            let proposalMap = new Map<string, any>(Object.entries(proposalJson))
            let telegram = proposalMap.get('telegram')
            if(telegram){
                if (telegram.includes(socialId)){
                    return false
                }else{
                    telegram.push(socialId)
                    proposalMap.set('telegram', telegram)
                    proposalMap = JSON.parse(JSON.stringify(Object.fromEntries(proposalMap)))
                    saveNewProposal(proposalMap)
                    return true
                }
            }else{
                let telegram = []
                telegram.push(socialId)
                proposalMap.set('telegram', telegram)
                proposalMap = JSON.parse(JSON.stringify(Object.fromEntries(proposalMap)))
                saveNewProposal(proposalMap)
                return true
            }
        }else{
            let proposalMap = new Map()
            let telegram = []
            telegram.push(socialId)
            proposalMap.set('telegram', telegram)
            proposalMap = JSON.parse(JSON.stringify(Object.fromEntries(proposalMap)))
            saveNewProposal(proposalMap)
            return true
        }
    }

    public removeProposal(socialId: string){
        let proposalJson = readNewProposal()
        if(proposalJson){
            let proposalMap = new Map<string, any>(Object.entries(proposalJson))
            let telegram = proposalMap.get('telegram')
            if (telegram){
                if(telegram.includes(socialId)){
                    let index = telegram.indexOf(socialId)
                    telegram.splice(index, 1)
                    console.log(telegram)
                    proposalMap.set('telegram', telegram)
                    proposalMap = JSON.parse(JSON.stringify(Object.fromEntries(proposalMap)))
                    console.log(proposalMap)
                    saveNewProposal(proposalMap)
                    return true
                }
            }
        }
        return false
    }

    public setVote(socialId: string){
        let voteJson = readNewVote()
        if(voteJson){
            let voteMap = new Map<string, any>(Object.entries(voteJson))
            let telegram = voteMap.get('telegram')
            if(telegram){
                if (telegram.includes(socialId)){
                    return false
                }else{
                    telegram.push(socialId)
                    voteMap.set('telegram', telegram)
                    voteMap = JSON.parse(JSON.stringify(Object.fromEntries(voteMap)))
                    saveNewVote(voteMap)
                    return true
                }
            }else{
                let telegram = []
                telegram.push(socialId)
                voteMap.set('telegram', telegram)
                voteMap = JSON.parse(JSON.stringify(Object.fromEntries(voteMap)))
                saveNewVote(voteMap)
                return true
            }
        }else{
            let voteMap = new Map()
            let telegram = []
            telegram.push(socialId)
            voteMap.set('telegram', telegram)
            voteMap = JSON.parse(JSON.stringify(Object.fromEntries(voteMap)))
            saveNewVote(voteMap)
            return true
        }
    }

    public getVote(socialId : string){
        let voteJson = readNewVote()
        if(voteJson){
            let voteMap = new Map<string, any>(Object.entries(voteJson))
            let telegram = voteMap.get('telegram')
            if(telegram){
                if (telegram.includes(socialId)){
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
    }

    public removeVote(socialId: string){
        let voteJson = readNewVote()
        if(voteJson){
            let voteMap = new Map<string, any>(Object.entries(voteJson))
            let telegram : string[] = voteMap.get('telegram')
            if (telegram){
                if(telegram.includes(socialId)){
                    let index = telegram.indexOf(socialId)
                    telegram.splice(index, 1)
                    voteMap.set('telegram', telegram)
                    voteMap = JSON.parse(JSON.stringify(Object.fromEntries(voteMap)))
                    saveNewVote(voteMap)
                    return true
                }
            }
        }
        return false
    }

    public getProposal(socialId : string){
        let proposalJson = readNewProposal()
        if(proposalJson){
            let proposalMap = new Map<string, any>(Object.entries(proposalJson))
            let telegram = proposalMap.get('telegram')
            if(telegram){
                if (telegram.includes(socialId)){
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
    }

}

