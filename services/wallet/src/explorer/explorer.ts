import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network, NetworkEndpoints } from '@injectivelabs/networks'
import {Manager} from "./manager"
import { PriceAnalyzer } from "../pyth/priceAnalyzer"

export class Explorer{
    /**
     * 
     */
    private endpoints : NetworkEndpoints
    private indexerGrpcExplorerStream : IndexerGrpcExplorerStream
    private manager : Manager
    private priceAnalyzer : PriceAnalyzer
    constructor(private network : Network){
        this.network = network
        this.endpoints = getNetworkEndpoints(this.network)
        this.indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(this.endpoints.indexer)
        this.manager = new Manager()
        this.priceAnalyzer = new PriceAnalyzer(this.network)
    }

    public listen(){
        try {
            console.log(`Start listen transaction`)
            let streamFn = this.indexerGrpcExplorerStream.streamTransactions.bind(this.indexerGrpcExplorerStream)

            const callback = (transactions: any) => {
                
                this.priceAnalyzer.highLow()
                this.manager.transactionAnalyzer(transactions)
                
            }

            const streamFnArgs = {
            callback
            }

            streamFn(streamFnArgs)

        } catch (error) {
            console.log(`Something when wrong... restarting the listener`)
            this.listen()
        }
        
    }
}
    