import { Network } from '@injectivelabs/networks'
import {Express, Request, Response} from 'express'
import { authentification } from "../utils"
import { Wallet } from '../../wallets'

export function deposit(walletService : Express, network : Network){
    walletService.get('/wallet/deposit/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){
            console.log(req.body)
            let userBody = JSON.parse(JSON.stringify(req.body))
            let wallet = new Wallet(network)
            let data = await wallet.receiveAddress(userBody.socialId, userBody.socialName)
            console.log(data)
            res.status(200).send(data)
        }
    })
}