import { IBase } from "@/shared/IBase";

export interface IQuoteDiscount extends IBase {
	Id :number;
QuoteDiscountId :string;
TenantId :number;
QuoteId :number;
QuoteAssetId :number;
DiscountTypeCode :string;
DiscountValue :number;
DiscountAmount :number;
ReasonCode :string;
ApprovalRequestId :number;
ApprovedBy :number;
ApprovedOn :Date;

}