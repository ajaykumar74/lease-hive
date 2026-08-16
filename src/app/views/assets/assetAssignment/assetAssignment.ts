import { IBase } from "@/shared/IBase";

export interface IAssetAssignment extends IBase {
	Id :number;
AssetAssignmentId :string;
TenantId :number;
AssetId :number;
PartyId :number;
PartyLocationId :number;
CustomerDepartmentId :number;
AssetUserId :number;
AssignmentType :string;
AssignedFrom :Date;
AssignedTo :Date;
IsPrimary : boolean;
AssignmentStatusId :number;
ReferenceType :string;
ReferenceId :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;
AcquisitionCost :number;
ResidualValueAmount: number;

}