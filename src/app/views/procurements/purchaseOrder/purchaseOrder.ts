import { IBase } from "@/shared/IBase";
import { IPurchaseOrderLine } from '../purchaseOrderLine/purchaseOrderLine';

export interface IPurchaseOrder extends IBase {
	Id :number;
PurchaseOrderId :string;
TenantId :number;
PONo :string;
VersionNo :number;
BuyingOrganisationId :number;
SupplierPartyId :number;
SupplierAwardId :number;
PurchaseOrderStatusId :number;
PODate :Date;
CurrencyCode :string;
Subtotal :number;
TaxAmount :number;
ChargeAmount :number;
TotalAmount :number;
PaymentTermCode :string;
DeliveryLocationId :number;
SupplierNameSnapshot :string;
SupplierTaxSnapshot :string;
ApprovalRequestId :number;
IssuedOn :Date;
RecordStatus :string;
LineItems: IPurchaseOrderLine[];

}

export interface IPurchaseOrderApprovalHistory {
    StepNo: number;
    ActionCode: string;
    ActionDateTime: Date;
    ApproverUserId: number;
    ApproverName: string;
    Comments: string;
}

export interface IPurchaseOrderApprovalWorkflow {
    PurchaseOrderId: number;
    PONo: string;
    StatusCode: string;
    TotalAmount: number;
    CurrencyCode: string;
    ApprovalRequestId?: number;
    ApprovalRequestNumber: string;
    ApprovalStatus: string;
    CanSubmit: boolean;
    IsEditable: boolean;
    CanCurrentUserAction: boolean;
    PendingApprovalLevel?: number;
    PendingApprovers: string[];
    ApprovedByName: string;
    ApprovedOn?: Date;
    ApprovalHistory: IPurchaseOrderApprovalHistory[];
}
