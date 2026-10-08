import { IBase } from "@/shared/IBase";

export interface IAssetInspection extends IBase {
	Id :number;
AssetInspectionId :string;
TenantId :number;
AssetId :number;
InspectionTypeId :string;
InspectionNo :string;
InspectionDateTime :Date;
LocationId :number;
PartyId :number;
InspectorUserId :number;
ConditionGradeId :number;
OverallScore :number;
InspectionStatusId :number;
Remarks :string;
CompletedOn :Date;
AssetDisplayName?: string;
LocationDisplayName?: string;
PartyDisplayName?: string;
InspectorUserDisplayName?: string;
ConditionGradeDisplayName?: string;
InspectionStatusDisplayName?: string;

}
