import { IBase } from "@/shared/IBase";

export interface IInsuranceRecovery extends IBase {
	Id :number;
TenantId :number;
InsuranceClaimId :number;
RecoveryTypeCode :string;
RecoveryPartyId :number;
ExpectedAmount :number;
RecoveredAmount :number;
CurrencyCode :string;
RecoveryDate :Date;
FinanceReferenceId :number;
StatusCode :string;
RecordStatus :string;

}