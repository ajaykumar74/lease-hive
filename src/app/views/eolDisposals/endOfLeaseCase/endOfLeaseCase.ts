import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseCase extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseNo :string;
LeaseContractId :number;
LeaseContractAssetId :number;
AssetId :number;
CustomerPartyId :number;
OrganisationId :number;
EndOfLeaseReasonId :number;
EndOfLeaseStatusId :number;
ContractEndDate :Date;
TargetReturnDate :Date;
AssignedToUserId :number;
OpenedAt :Date;
ClosedAt :Date;
RecordStatus :string;

}