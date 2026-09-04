import { IBase } from "@/shared/IBase";

export interface IFinanceApprovalAction extends IBase {
	Id :number;
TenantId :number;
FinanceApprovalRequestId :number;
ActionByUserId :number;
ActionCode :string;
ActionAtUtc :Date;
Comments :string;
AuthoritySnapshot :string;
RecordStatus :string;

}