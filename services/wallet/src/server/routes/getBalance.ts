import { Express, Request, Response } from "express"
import { authentification } from "../utils"
import { Wallet } from "../../wallets"
import { Network } from "@injectivelabs/networks"


export function getBalance(walletService : Express, network : Network){
    walletService.get('/wallet/balance/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){

            let userBody = JSON.parse(JSON.stringify(req.body))

            let wallet = new Wallet(network)
            let balance = await wallet.getBalance(userBody.socialId, userBody.socialName)

            res.status(200).send(balance)
        }

    })
}