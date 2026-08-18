import { IBase } from "@/shared/IBase";

export interface IOriginationDocumentLink extends IBase {
	Id :number;
OriginationDocumentLinkId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
DocumentId :number;
DocumentPurposeCode :string;
IsPrimary : boolean;

}