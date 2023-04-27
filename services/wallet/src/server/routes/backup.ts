import { Network } from '@injectivelabs/networks'
import {Express, Request, Response} from 'express'
import { authentification } from "../utils"
import { Wallet } from '../../wallets'

export function backup(walletService : Express, network : Network){
    walletService.get('/wallet/backup/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){
            console.log(req.body)
            let userBody = JSON.parse(JSON.stringify(req.body))
            let wallet = new Wallet(network)
            let privateKey = await wallet.backupPrivateKey(userBody.socialId, userBody.socialName)
            let mnemonic = await wallet.backupSeed(userBody.socialId, userBody.socialName)
            let data = new Map<string, string>()
            data.set('mnemonic', mnemonic)
            data.set('privatekey', privateKey)
            let dataString = JSON.stringify(Object.fromEntries(data))
            res.status(200).send(dataString)
        }
    })
}