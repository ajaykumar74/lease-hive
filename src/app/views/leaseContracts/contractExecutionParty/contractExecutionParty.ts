import { IBase } from "@/shared/IBase";

export interface IContractExecutionParty extends IBase {
	Id :number;
ContractExecutionPartyId :string;
TenantId :number;
ContractExecutionId :number;
LeaseContractPartyId :number;
SignerPartyId :number;
SignerNameSnapshot :string;
SignerEmailSnapshot :string;
SigningOrder :number;
SignatureStatusCode :string;
SignedOn :Date;
ExternalSignerId :string;

}