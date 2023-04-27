import {Express, Request, Response} from "express"
import {NewWallet} from "../../wallets"
import {authentification} from "../utils"

export function createWallet(walletService : Express){
        walletService.post('/wallet/create/', async (req : Request, res : Response)=>{

            if(authentification(req, res)){
        
                let userBody = JSON.parse(JSON.stringify(req.body))

                let newWallet = new NewWallet()
                let create = await newWallet.createWallet(userBody.socialId, userBody.socialName)
                console.log(create)
                if(create){
                    res.status(200).send(create)
                }else{
                    res.status(409).send(create)
                }
            }
            
        })
}
