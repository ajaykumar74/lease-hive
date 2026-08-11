import { IBase } from "@/shared/IBase";

export interface IContact extends IBase {
	Id :number;
FirstName :string;
LastName :string;
EmailId :string;
Mobile :string;
Designation :string;
Department :string;
IsDeleted : boolean;
DeletedReason :string;
IsConfidential : boolean;
CustomerId :number;
RecordById :number;
RecordByType :string;
Name?: string
}