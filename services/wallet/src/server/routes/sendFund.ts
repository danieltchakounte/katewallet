import { authentification } from "../utils"
import { Express, Request, Response} from 'express'
import { Wallet } from "../../wallets"
import { Network } from "@injectivelabs/networks"

export function sendFund(walletService : Express, network : Network){
    walletService.post('/wallet/send/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            console.log(userBody)  
            let wallet = new Wallet(network)
            let data = await wallet.sendFund(
                userBody.socialId, 
                userBody.to_address,
                userBody.socialName, 
                userBody.amount, 
                userBody.denom
            )
            
            res.status(200).send(JSON.stringify(data))
        }
    })
}