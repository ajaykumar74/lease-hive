import { IBase } from "@/shared/IBase";

export interface ISupportTicket extends IBase {
	Id: number;
	CustomerId: number;
	Title: string;
	Description: string;
	Status?: string;
	AssignedTo?: number;
	ClosedAt?: Date;
	Priority: string;
	Category: string;
	RequestType: string;
	TicketClosed: boolean;
	BusinessName: string;
	LoggedInUserJson: string;
	LoggedInUserFormatted: any;
	TicketMessages: ITicketMessage[];
}

export interface ITicketMessage extends IBase {
	TicketId: number;
	SenderType: string;
	SenderId: number;
	Message: string;
	IsInternalNote: boolean;
	CreatedByCode: string;
	CreatedDateTime: Date;
	BusinessName: string;
}

export interface ITicketStatusHistory extends IBase {
	TicketId: number;
	OldStatus: string;
	NewStatus: string;
	ChangedById: number;
	Description: string;
}

export type TagSeverity =
	| 'success'
	| 'secondary'
	| 'info'
	| 'warn'
	| 'danger'
	| 'contrast';
