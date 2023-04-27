import { Express, Request, Response} from 'express'
import { authentification } from '../utils'
import { Network } from '@injectivelabs/networks'
import {Manager} from "../../explorer/manager/manager"

export function setProposalAlert(walletService : Express, network : Network){
    walletService.post('/alert/proposal/', (req : Request, res : Response)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            let manager = new Manager()

            let alert = manager.setProposal(userBody.socialId)

            res.status(200).send(alert)
        }
    })
}