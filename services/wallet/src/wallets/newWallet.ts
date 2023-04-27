import { ethers } from "ethers"
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { DataService, Registration } from "../database"


export class NewWallet{

    /**
     * 
     */

    private dataservice : DataService

    constructor(){
        this.dataservice = new DataService()
    }

    public async createWallet(socialId: string, socialName: string):  Promise<Registration | boolean>{
        let walletExist = await this.dataservice.getReceiveAddress(socialId, socialName)
        if(walletExist.length < 1){
            
            let wallet = ethers.Wallet.createRandom()

            let ethAddress = wallet.address
            let mnemonic = wallet.mnemonic
            let privateKey = wallet.privateKey
            let injAddress = this.convertToInjectiveAddress(ethAddress)

            return await this.dataservice.registerNewUser({
                socialId,
                socialName,
                ethAddress,
                injAddress,
                mnemonic,
                privateKey
            })
        }else{
            return false
        }
        
    }

    private convertToInjectiveAddress(ethAddress: string) : string{
        return getInjectiveAddress(ethAddress)
    }

}

