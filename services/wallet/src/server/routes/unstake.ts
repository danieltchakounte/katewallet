import { Network } from "@injectivelabs/networks"
import { Earn } from "../../staking"
import { authentification } from "../utils"
import { Express, Request, Response} from 'express'


export function unstake(walletService : Express, network : Network){
    walletService.post('/earn/unstake/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){

            let userBody = JSON.parse(JSON.stringify(req.body))
            let staking = new Earn(network)
            let data = await staking.unStake(
                userBody.socialId, 
                userBody.validatorAddress, 
                userBody.amount,
                userBody.socialName
            )
            
            res.status(200).send(JSON.stringify(data)) 
        }
    })
}