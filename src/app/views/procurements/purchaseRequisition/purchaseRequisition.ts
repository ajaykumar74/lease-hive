import { IBase } from "@/shared/IBase";
import { IPurchaseRequisitionLine } from '../purchaseRequisitionLine/purchaseRequisitionLine';

export interface IPurchaseRequisition extends IBase {
	Id :number;
PurchaseRequisitionId :string;
TenantId :number;
PRNo :string;
BuyingOrganisationId :number;
RequestingOrganisationUnitId :number;
RequestedByUserId :number;
PurchaseRequisitionStatusId :number;
RequisitionDate :Date;
RequiredByDate :Date;
SourceReferenceType :string;
SourceReferenceId :number;
CurrencyCode :string;
EstimatedTotal :number;
Justification :string;
RecordStatus :string;
LineItems: IPurchaseRequisitionLine[];

}

export interface IPurchaseRequisitionApprovalHistory {
    StepNo: number;
    ActionCode: string;
    ActionDateTime: Date;
    ApproverUserId: number;
    ApproverName: string;
    Comments: string;
}

export interface IPurchaseRequisitionApprovalWorkflow {
    PurchaseRequisitionId: number;
    PRNo: string;
    StatusCode: string;
    EstimatedTotal: number;
    CurrencyCode: string;
    ApprovalRequestId?: number;
    ApprovalRequestNumber: string;
    ApprovalStatus: string;
    CanSubmit: boolean;
    IsEditable: boolean;
    CanCurrentUserAction: boolean;
    PendingApprovalLevel?: number;
    PendingApprovers: string[];
    ApprovalHistory: IPurchaseRequisitionApprovalHistory[];
}
