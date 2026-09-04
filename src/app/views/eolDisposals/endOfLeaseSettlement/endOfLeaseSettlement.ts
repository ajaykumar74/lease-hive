import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseSettlement extends IBase {
	Id :number;
TenantId :number;
SettlementNo :string;
EndOfLeaseCaseId :number;
CustomerPartyId :number;
SettlementDate :Date;
CurrencyCode :string;
GrossChargeAmount :number;
GrossCreditAmount :number;
NetSettlementAmount :number;
StatusCode :string;
ApprovedByUserId :number;
ApprovedAt :Date;
RecordStatus :string;

}