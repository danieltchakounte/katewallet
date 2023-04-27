import {Request, Response} from 'express'

export function authentification(req : Request, res : Response): boolean{
    let key = req.headers.authorization
    if (key === getCurrentKey()){
        return true
    }else{
        res.status(401).send()
        return false
    }
}

function getCurrentKey(){
    return ""
}
