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
AssetDisplayName?: string;
PartyDisplayName?: string;
PartyLocationDisplayName?: string;
CustomerDepartmentDisplayName?: string;
AssetUserDisplayName?: string;
/** Sanitised compliance summaries returned for delivery; no document or licence numbers. */
KycStatus?: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
DrivingEligibilityStatus?: 'Eligible' | 'Ineligible' | 'Pending' | 'NotRequired';
AssignmentType :string;
AssignedFrom :Date;
AssignedTo :Date | null;
IsPrimary : boolean;
AssignmentStatusId :number;
ReferenceType :string;
ReferenceId :string;
EffectiveFrom :Date;
EffectiveTo :Date | null;
RecordStatus :string;
AcquisitionCost :number;
ResidualValueAmount: number;

}

/** Immutable values supplied when an assignment is opened from a lease delivery. */
export interface IAssetAssignmentDeliveryContext {
AssetId: number;
AssetLabel: string;
PartyId: number;
PartyLabel?: string;
ReferenceType: string;
ReferenceId: string;
/** Category policy is passed from the delivery so KYC is never imposed on non-vehicle assets. */
RequiresDriverKyc?: boolean;
RequiredDrivingLicenceClass?: string;
}

export interface IAssetUserCompliance {
KycStatus: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
DrivingEligibilityStatus: 'Eligible' | 'Ineligible' | 'Pending' | 'NotRequired';
RequiresDriverKyc: boolean;
RequiredDrivingLicenceClass?: string;
}
