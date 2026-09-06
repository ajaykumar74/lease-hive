import { IBase } from "@/shared/IBase";

export interface IRFQ extends IBase {
	Id :number;
RFQId :string;
TenantId :number;
RFQNo :string;
PurchaseRequisitionId :number;
BuyingOrganisationId :number;
RFQStatusCode :string;
IssueDateTime :Date;
ResponseDueDateTime :Date;
CurrencyCode :string;
CommercialTerms :string;
RecordStatus :string;

}