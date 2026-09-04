import { IBase } from "@/shared/IBase";

export interface IInsurancePolicyAsset extends IBase {
	Id :number;
TenantId :number;
InsurancePolicyId :number;
AssetId :number;
LeaseContractId :number;
CoverageTypeId :number;
CoverageStartDate :Date;
CoverageEndDate :Date;
InsuredValue :number;
DeductibleAmount :number;
CurrencyCode :string;
BeneficiaryPartyId :number;
StatusCode :string;
RecordStatus :string;

}