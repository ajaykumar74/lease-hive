import { IBase } from "@/shared/IBase";

export interface ISupportTicketMessage extends IBase {
	Id :number;
TenantId :number;
SupportTicketId :number;
SenderApplicationUserId :number;
SenderTypeCode :string;
Message :string;
IsInternalNote : boolean;

}