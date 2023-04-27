import { Network } from "@injectivelabs/networks";
import { Express, Request, Response } from "express"
import { authentification } from "../utils";
import {  Earn } from "../../staking";

export function getDelegation(walletService : Express, network : Network){
    walletService.get('/chain/delegation/', async (req, res)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            let earn = new Earn(network)
            let validatorDetails = await earn.getValidatorOf(userBody.socialId, userBody.socialName)
            console.log(validatorDetails)
            let details = new Map<string, any>()
            let share = new Map<string, string>()
            validatorDetails.forEach((value : any, key:string)=>{
                console.log(value)
                console.log(key)
                share.set('stake', value.get('stake'))
                share.set('reward', value.get('reward'))
                details.set(key, JSON.parse(JSON.stringify(Object.fromEntries(share))))
            })
            let validatorJson = JSON.stringify(Object.fromEntries(details))
            console.log(validatorJson)
            res.status(200).send(validatorJson)
            
        }
    })
}