import { 
    MsgDelegate, 
    MsgBroadcasterWithPk, 
    MsgBeginRedelegate, 
    MsgUndelegate, 
    MsgWithdrawDelegatorReward, 
    TxResponse } from "@injectivelabs/sdk-ts"
import { BigNumberInBase } from "@injectivelabs/utils"
import { 
    Network, 
    getNetworkEndpoints, 
    NetworkEndpoints } from "@injectivelabs/networks"
import {Validator} from "./validator"
import {DataService} from "../database"
import {SendFundsResponse} from "../wallets"

type ValidatorShare = Map<string, string> 

export class Earn{
    /**
     * 
     */
    private endpoint : NetworkEndpoints
    private validator : Validator
    private dataservice : DataService
    constructor(private network : Network){
        this.network = network
        this.endpoint = getNetworkEndpoints(this.network)
        this.validator = new Validator(this.network)
        this.dataservice = new DataService()
    }

    public async stake(
        from: string, 
        validatorAddress : string, 
        amountS: number,
        socialName : string):
        Promise<SendFundsResponse>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress
        let privateKey = walletInfo.privateKey

        const amount = new BigNumberInBase(amountS).toWei().toFixed()
        

        const msg = MsgDelegate.fromJSON({
        injectiveAddress,
        validatorAddress,
        amount: {
            denom: 'inj',
            amount: amount
        },
        })

        const txHash = await new MsgBroadcasterWithPk({
        privateKey,
        network: this.network,
        endpoints: this.endpoint,
        }).broadcast({
        msgs: msg,
        injectiveAddress,
        })

        return this.hashChecker(txHash)

    }
    public async reStake(
        from : string, 
        sourceValidatorAddress : string, 
        destinationValidatorAddress : string, 
        amountS : number,
        socialName : string):
        Promise<SendFundsResponse>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress
        let privateKey = walletInfo.privateKey
        
        const amount = new BigNumberInBase(amountS).toWei().toFixed()
        const denom = "inj"
        
        const msg = MsgBeginRedelegate.fromJSON({
        injectiveAddress,
        dstValidatorAddress: destinationValidatorAddress,
        srcValidatorAddress: sourceValidatorAddress,
        amount: {
            denom,
            amount: amount
        },
        })

        const txHash = await new MsgBroadcasterWithPk({
        privateKey,
        network: this.network,
        endpoints: this.endpoint,
        }).broadcast({
        msgs: msg,
        injectiveAddress,
        })

        return this.hashChecker(txHash)

    }
    public async unStake(
        from : string, 
        validatorAddress : string, 
        amountS: number, 
        socialName : string){

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress
        let privateKey = walletInfo.privateKey
        const denom = "inj"
        const amount = new BigNumberInBase(amountS).toWei().toFixed()


        const msg = MsgUndelegate.fromJSON({
        injectiveAddress,
        validatorAddress,
        amount: {
            denom,
            amount: amount
        },
        })

        const txHash = await new MsgBroadcasterWithPk({
        privateKey,
        network: this.network,
        endpoints: this.endpoint,
        }).broadcast({
        msgs: msg,
        injectiveAddress,
        })

        return this.hashChecker(txHash)


    }
    public async claimReward(
        from : string, 
        validatorAddress: string,
        socialName : string
        ):
        Promise<SendFundsResponse>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress
        let privateKey = walletInfo.privateKey

     

        const msg = MsgWithdrawDelegatorReward.fromJSON({
        delegatorAddress: injectiveAddress,
        validatorAddress,
        })

        const txHash = await new MsgBroadcasterWithPk({
        privateKey,
        network: this.network,
        endpoints: this.endpoint,
        }).broadcast({
        msgs: msg,
        injectiveAddress,
        })

        return this.hashChecker(txHash)
    }

    public async getValidatorOf(from : string, socialName : string): Promise<Map<string, ValidatorShare>>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress

        let validatorOf : Map<string, ValidatorShare> = new Map()

        let delegationDetails = await this.validator.getAllDelegation(injectiveAddress)
        console.log(delegationDetails)
        console.log(delegationDetails.delegations)
        if (delegationDetails.delegations.length > 0){
            delegationDetails.delegations.forEach(element => {
                console.log(element.balance)
                let share : ValidatorShare = new Map()
                share.set('stake', element.balance.amount)
                share.set('reward', String(Number(element.delegation.shares) - Number(element.balance.amount)))
                validatorOf.set(
                    element.delegation.validatorAddress, 
                    share
                )
                }
            )
            }
        return validatorOf
    }
    public async getStakedAmount(from : string, socialName : string) : Promise<number>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress

        let walletValidator = await this.getValidatorOf(from, socialName)

        console.log(walletValidator)
        console.log(Object.keys(walletValidator).length)
        console.log(Object.keys(walletValidator))
        let stakedAmount = 0

        
        walletValidator.forEach((value : ValidatorShare , key : string) => {
            console.log('in loop')
            let share = walletValidator.get(key)!
            console.log(value.get('stake'))
            stakedAmount += Number(value.get('stake'))
        })
        
        return stakedAmount
    }
    public async getUnclaimedReward(from : string, socialName : string): Promise<number>{

        let walletInfo = await this.dataservice.getWallet(from, socialName)
        let injectiveAddress = walletInfo.injAddress
        
        let walletValidator = await this.getValidatorOf(from, socialName)

        let rewardAmount = 0

        walletValidator.forEach((value : ValidatorShare , key : string) => {
            console.log('in loop')
            let share = walletValidator.get(key)!
            console.log(value.get('reward'))
            rewardAmount += Number(value.get('reward'))
        })
        /*if(Object.keys(walletValidator).length > 0){
            Object.keys(walletValidator).forEach(element => {
                rewardAmount += Number(walletValidator.get(element)?.reward)
            });
        }*/
        return rewardAmount
    }

    private hashChecker(txHash : TxResponse) : SendFundsResponse{
        if (txHash.code !== 0) {

            let data : SendFundsResponse = {
                worked: false,
                hash : txHash.txHash
            }
            return data
        } else {
            let data : SendFundsResponse = {
                worked: true,
                hash : txHash.txHash
            }
            return data
        }
    }

    
}