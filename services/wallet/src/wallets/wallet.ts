import { ChainGrpcBankApi, MsgSend, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network, NetworkEndpoints } from '@injectivelabs/networks'
import { BigNumberInBase  }from '@injectivelabs/utils'
import { DataService } from "../database"
import { Earn } from "../staking"


export interface SendFundsResponse {
    worked: boolean,
    hash : string
}
type WalletAvailable = Map<string, string>
type DelegationEarn = Map<string, string>
type WalletBalanceInfo = Map<string, any>
/**interface WalletBalanceInfo{
    available : Map<string, string>,
    staked : number,
    reward : number
}*/

export class Wallet{
    /**
     * 
     */
    private chainGrpcBankApi : ChainGrpcBankApi
    private dataService : DataService
    private endpoints : NetworkEndpoints
    private staking : Earn
    constructor(private network : Network){
        this.network = network
        this.dataService = new DataService()
        this.endpoints = getNetworkEndpoints(this.network)
        this.chainGrpcBankApi = new ChainGrpcBankApi(this.endpoints.grpc)
        this.staking = new Earn(this.network)
    }

    public async receiveAddress(socialId: string, socialName : string):Promise<string>{
        return await this.dataService.getReceiveAddress(socialId, socialName)
    }
    public async backupSeed(socialId: string, socialName : string) : Promise<string>{
        return (await this.dataService.getWallet(socialId, socialName)).mnemonic
    }
    public async backupPrivateKey(socialId: string, socialName : string){
        return (await this.dataService.getWallet(socialId, socialName)).privateKey
    }
    public async sendFund(
        from : string, 
        to: string, 
        socialName : string,
        sendAmount : number,
        denom: string): 
        Promise<SendFundsResponse | boolean>{
            
        try {
            let dstFunds : string = ''
            let walletInfo = await this.dataService.getWallet(from, socialName)

            if (to.startsWith('inj')){
                dstFunds = to
            }else{
                dstFunds = await this.dataService.getReceiveAddress(to, socialName)
            }
        
            let privateKey = walletInfo.privateKey
            let injectiveAddress = walletInfo.injAddress

            let amount = {
            denom,
            amount: new BigNumberInBase(sendAmount).toWei().toFixed()
            }

            let msg = MsgSend.fromJSON({
            amount,
            srcInjectiveAddress: injectiveAddress,
            dstInjectiveAddress: dstFunds,
            })

            let txHash = await new MsgBroadcasterWithPk({
            privateKey,
            network: this.network,
            endpoints: this.endpoints
            }).broadcast({
            msgs: msg,
            injectiveAddress,
            })

           

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

        } catch (error) {

            console.log("------------ An Error occured when sending Funds------------------------")
            console.log(error)
            return false
        }
    }
    public async getBalance(socialId: string, socialName : string): Promise<string | boolean>{
        let walletBalanceAvailabe : WalletAvailable = new Map()
        let walletBalance : WalletBalanceInfo = new Map()
        let walletInfo =  await this.dataService.getWallet(socialId, socialName)
        try {
        

            const balances = await this.chainGrpcBankApi.fetchBalances(walletInfo.injAddress)
            balances.balances.forEach(element =>{
                walletBalanceAvailabe.set(element.denom, element.amount)
            })
            
            let stakedAmount = await this.staking.getStakedAmount(socialId, socialName)
            let rewardAmount = await this.staking.getUnclaimedReward(socialId, socialName)

            
            
            let delagationEarn : DelegationEarn = new Map()
            delagationEarn.set('staked', String(stakedAmount))
            delagationEarn.set('reward', String(rewardAmount))


            walletBalance.set('available', JSON.parse(JSON.stringify(Object.fromEntries(walletBalanceAvailabe))))
            walletBalance.set('delegation', JSON.parse(JSON.stringify(Object.fromEntries(delagationEarn))))
            

            
            let walletBalanceJson = JSON.stringify(Object.fromEntries(walletBalance))
            
            
            return walletBalanceJson

        } catch (error) {
            console.log(error)
            return false
        }

    }
    /*public getHistory(socialId: string){

    } */  
}