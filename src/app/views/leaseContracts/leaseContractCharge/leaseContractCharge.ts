import { IBase } from "@/shared/IBase";

export interface ILeaseContractCharge extends IBase {
	Id :number;
LeaseContractChargeId :string;
TenantId :number;
LeaseContractId :number;
ChargeTypeCode :string;
ChargeDescription :string;
ChargeAmount :number;
CurrencyCode :string;
TaxType :number;
TaxAmount :number;
FrequencyCode :string;
DueEventCode :string;
IsCapitalised : boolean;

}