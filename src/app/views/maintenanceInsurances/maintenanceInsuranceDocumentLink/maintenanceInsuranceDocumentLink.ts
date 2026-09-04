import { IBase } from "@/shared/IBase";

export interface IMaintenanceInsuranceDocumentLink extends IBase {
	Id :number;
TenantId :number;
ReferenceTypeCode :string;
ReferenceId :number;
DocumentId :number;
DocumentRoleCode :string;
IsPrimary : boolean;
RecordStatus :string;

}