import { Express, Request, Response} from 'express'
import { authentification } from '../utils'
import { Network } from '@injectivelabs/networks'
import { Pyth } from '../../pyth/pyth'

export function showPriceAlert(walletService : Express, network : Network){
    walletService.get('/pyth/alert/', (req : Request, res : Response)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            let pythNetwork = new Pyth(network)

            let alert = pythNetwork.showPriceAlert(userBody.socialId)

            res.status(200).send(alert)
        }
    })
}