import { IBase } from "@/shared/IBase";

export interface IProcurementDocumentLink extends IBase {
	Id :number;
ProcurementDocumentLinkId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
DocumentId :number;
DocumentPurposeCode :string;
IsPrimary : boolean;

}