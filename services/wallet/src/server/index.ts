import * as express from "express"
import {Explorer} from "../explorer"
import { Network } from '@injectivelabs/networks'
import {
    claimReward, 
    createWallet, 
    deposit, 
    getBalance, 
    getPrice, 
    getValidator, 
    sendFund, 
    stake,
    backup,
    getDelegation,
    unstake,
    setPriceAlert,
    getPriceAlert,
    removePriceAlert,
    getProposalAlert,
    getVoteAlert,
    setProposalAlert,
    setVoteAlert,
    removeProposalAlert,
    removeVoteAlert} from "./routes"

let network : Network = Network.TestnetK8s
let walletServices = express()
walletServices.use(express.json())

let explorer = new Explorer(network)
//start listen all core chain transaction
explorer.listen()


createWallet(walletServices)
getBalance(walletServices, network)
getValidator(walletServices, network)
sendFund(walletServices, network)
stake(walletServices, network)
claimReward(walletServices, network)
deposit(walletServices, network)
getPrice(walletServices, network)
backup(walletServices, network)
getDelegation(walletServices, network)
unstake(walletServices, network)
setPriceAlert(walletServices, network)
getPriceAlert(walletServices, network)
removePriceAlert(walletServices, network)
getProposalAlert(walletServices, network)
getVoteAlert(walletServices, network)
setProposalAlert(walletServices, network)
setVoteAlert(walletServices, network)
removeProposalAlert(walletServices, network)
removeVoteAlert(walletServices, network)

//start the server 

walletServices.listen(0, ()=>{
    console.log(`Wallet Services is online at port ${0}`)
})






