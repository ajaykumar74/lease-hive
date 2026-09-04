import { IBase } from "@/shared/IBase";

export interface IFinanceDocumentLink extends IBase {
	Id :number;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
DocumentId :number;
DocumentRole :string;
IsPrimary : boolean;
RecordStatus :string;

}