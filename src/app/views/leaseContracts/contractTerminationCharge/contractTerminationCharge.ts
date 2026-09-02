import { IBase } from "@/shared/IBase";

export interface IContractTerminationCharge extends IBase {
	Id :number;
ContractTerminationChargeId :string;
TenantId :number;
ContractTerminationId :number;
ChargeTypeCode :string;
Description :string;
Amount :number;
CurrencyCode :string;
TaxAmount :number;
FinanceReferenceId :number;

}