import { Express, Request, Response} from 'express'
import { authentification } from '../utils'
import { Network } from '@injectivelabs/networks'
import { Pyth } from '../../pyth/pyth'

export function getPrice(walletService : Express, network : Network){
    walletService.get('/pyth/price/', async (req : Request, res : Response)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            let pythNetwork = new Pyth(network)

            let price = await pythNetwork.getPrice(userBody.priceFeedId)

            res.status(200).send(String(price))
        }
    })
}