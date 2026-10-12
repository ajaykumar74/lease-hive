import { IBase } from "@/shared/IBase";

export interface IDocumentType extends IBase {
	Id :number;
DocumentTypeId :string;
Code :string;
Name :string;
Description :string;
SensitivityLevel :number;
IsActive : boolean;

}