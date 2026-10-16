import { IBase } from "@/shared/IBase";

export interface ISupportTicketStatusHistory extends IBase {
	Id :number;
TenantId :number;
SupportTicketId :number;
PreviousStatusCode :string;
NewStatusCode :string;
ChangedByApplicationUserId :number;
ChangeNote :string;

}