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
LineItems: IRFQLineItem[];

}

export interface IRFQLineItem extends IBase {
    RFQLineId?: string;
    PurchaseRequisitionLineId: number;
    LineNo: number;
    Description: string;
    AssetCategoryId: number;
    AssetCategoryName: string;
    PRQuantity: number;
    Quantity: number;
    UOMId: number;
    UOMName: string;
    SpecificationsJson?: string;
    RequiredByDate?: Date;
}

export interface IRFQPurchaseRequisitionContext {
    PurchaseRequisitionId: number;
    BuyingOrganisationId: number;
    CurrencyCode: string;
    StatusCode: string;
    LineItems: IRFQLineItem[];
}
