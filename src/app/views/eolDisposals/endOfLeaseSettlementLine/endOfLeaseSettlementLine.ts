import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseSettlementLine extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseSettlementId :number;
LineNo :number;
SettlementChargeTypeId :number;
SourceTypeCode :string;
SourceId :number;
Description :string;
Quantity :number;
RateAmount :number;
LineAmount :number;
CurrencyCode :string;
WaivedAmount :number;
RecordStatus :string;

}