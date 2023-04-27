import { Express, Request, Response} from 'express'
import { authentification } from '../utils'
import { Network } from '@injectivelabs/networks'
import {Manager} from "../../explorer/manager/manager"

export function getVoteAlert(walletService : Express, network : Network){
    walletService.post('/alert/vote/exist/', (req : Request, res : Response)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            let manager = new Manager()
            
            let alert = manager.getVote(userBody.socialId)

            res.status(200).send(alert)
        }
    })
}