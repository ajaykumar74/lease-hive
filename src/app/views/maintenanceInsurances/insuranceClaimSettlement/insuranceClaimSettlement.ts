import { IBase } from "@/shared/IBase";

export interface IInsuranceClaimSettlement extends IBase {
	Id :number;
TenantId :number;
InsuranceClaimId :number;
SettlementNo :string;
SettlementTypeCode :string;
SettlementDate :Date;
GrossSettlementAmount :number;
DeductibleAmount :number;
NetSettlementAmount :number;
CurrencyCode :string;
PayeePartyId :number;
FinanceReferenceId :number;
StatusCode :string;
RecordStatus :string;

}