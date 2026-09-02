import { IBase } from "@/shared/IBase";

export interface ILeaseContractDocumentLink extends IBase {
	Id :number;
LeaseContractDocumentLinkId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
DocumentId :number;
DocumentPurposeCode :string;
DocumentVersionNo :number;
IsPrimary : boolean;

}