import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseDisposalDocumentLink extends IBase {
	Id :number;
TenantId :number;
ReferenceTypeCode :string;
ReferenceId :number;
DocumentId :number;
DocumentRoleCode :string;
LinkedAt :Date;
LinkedByUserId :number;
RecordStatus :string;

}