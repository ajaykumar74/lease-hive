import { IBase } from "@/shared/IBase";

export interface ISupplierAward extends IBase {
	Id :number;
SupplierAwardId :string;
TenantId :number;
RFQId :number;
SupplierQuotationId :number;
SupplierPartyId :number;
AwardDateTime :Date;
TechnicalScore :number;
CommercialScore :number;
AwardAmount :number;
CurrencyCode :string;
SelectionReason :string;
ApprovalRequestId :number;
AwardedBy :number;

}