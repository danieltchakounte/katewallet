import { Network } from "@injectivelabs/networks";
import { Express, Request, Response } from "express"
import { authentification } from "../utils";
import { Validator } from "../../staking";

export function getValidator(walletService : Express, network : Network){
    walletService.get('/chain/validator/', async (req, res)=>{
        if(authentification(req, res)){
            let userBody = JSON.parse(JSON.stringify(req.body))
            if(userBody.validatorAddress.startsWith('injvaloper')){
                let validator = new Validator(network)
                let validatorDetails = await validator.getValidatorDetails(userBody.validatorAddress)
                res.status(200).send(validatorDetails)
            }else{
                //Invalid Data
                res.status(400).send()
            }
        }
    })
}