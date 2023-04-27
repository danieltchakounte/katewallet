import { Network } from "@injectivelabs/networks";
import { authentification } from "../utils";
import { Express, Response, Request} from 'express'
import { Earn } from "../../staking";


export function claimReward(walletService : Express, network : Network){
    walletService.post('/earn/claim/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){

            let userBody = JSON.parse(JSON.stringify(req.body))
            let stake = new Earn(network)
            let data = await stake.claimReward(userBody.socialId, userBody.validatorAddress, userBody.socialName)

            res.status(200).send(JSON.stringify(data))
        }
    })
}