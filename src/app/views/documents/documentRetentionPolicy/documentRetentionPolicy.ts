import { IBase } from "@/shared/IBase";

export interface IDocumentRetentionPolicy extends IBase {
	Id :number;
DocumentRetentionPolicyId :string;
Code :string;
Name :string;
RetentionDays :number;
AllowUserDelete : boolean;
IsActive : boolean;

}