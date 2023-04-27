import { ChainGrpcStakingApi, Pagination, Delegation, Validator as ValidatorType} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network, NetworkEndpoints } from '@injectivelabs/networks'

interface DelegationType {
    delegations: Delegation[];
    pagination: Pagination;
}
export class Validator{
    /**
     * 
     */
    private endpoints : NetworkEndpoints
    private chainGrpcStakingApi : ChainGrpcStakingApi
    constructor(private network : Network){
        this.network = network
        this.endpoints = getNetworkEndpoints(this.network)
        this.chainGrpcStakingApi =  new ChainGrpcStakingApi(this.endpoints.grpc)

    }
    public async getValidatorDetails(validatorAddress : string): Promise<ValidatorType>{

        const validator = await this.chainGrpcStakingApi.fetchValidator(validatorAddress)

        /**console.log("----------- get validator details--------------")
        
        console.log(validator)*/
        return validator
    }
    public async getAllValidatorDetails(): Promise<{
        validators: ValidatorType[],
        pagination : Pagination
    }>{

        let validators = await this.chainGrpcStakingApi.fetchValidators()
        
        /**console.log("----------- get ALL validator details--------------")
        console.log(validators)
        validators.validators.forEach(element => {
            if(!element.jailed){
            console.log(`------Description of ${element.description.moniker}`)
            console.log(`Validator Address : ${element.operatorAddress}`)
            console.log(`Validator details : ${element.description.details}`)
            console.log(`Validator Commission : rate (${element.commission.commissionRates.rate})`)
            console.log(`------Comission of ${element.operatorAddress}`)
            console.log(element.commission)
            }
        })*/

        return validators

    }
    public async  getAllDelegation(injectiveAddress : string): Promise<DelegationType>{

        let delegations = await this.chainGrpcStakingApi.fetchDelegationsNoThrow({
        injectiveAddress
        })

        return delegations
    }
}