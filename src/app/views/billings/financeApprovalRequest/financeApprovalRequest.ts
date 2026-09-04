import { IBase } from "@/shared/IBase";

export interface IFinanceApprovalRequest extends IBase {
	Id :number;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
WorkflowInstanceId :number;
RequestedByUserId :number;
RequestedAtUtc :Date;
ApprovalStatus :string;
Amount :number;
CurrencyCode :string;
RecordStatus :string;

}