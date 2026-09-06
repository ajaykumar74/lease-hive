import { IBase } from "@/shared/IBase";

export interface IPurchaseOrderAmendment extends IBase {
	Id :number;
PurchaseOrderAmendmentId :string;
TenantId :number;
PurchaseOrderId :number;
AmendmentNo :number;
AmendmentDate :Date;
ReasonCode :string;
Reason :string;
PreviousVersionNo :number;
NewVersionNo :number;
ApprovalRequestId :number;
ChangedBy :number;
ChangedOn :Date;

}