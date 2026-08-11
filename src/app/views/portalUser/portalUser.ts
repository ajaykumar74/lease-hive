import { IBase } from "@/shared/IBase";

export interface IPortalUser extends IBase {
	Id: number;
	Code: string;
	FirstName: string;
	LastName: string;
	EmailId: string;
	Mobile: string;
	Department: string;
	Role: string;
	Description: string;
	IsDeleted: boolean;
	DeletedReason: string;
	RecordById: number;
	RecordByType?: string;
}