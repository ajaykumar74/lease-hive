import { IBase } from "@/shared/IBase";

export interface IAssetReturn extends IBase {
	Id :number;
TenantId :number;
ReturnNo :string;
EndOfLeaseCaseId :number;
AssetId :number;
AssetReturnScheduleId :number;
ReturnedAt :Date;
ReturnLocationId :number;
ReceivedByUserId :number;
FinalMeasureReadingId :number;
ReturnInspectionId :number;
ReturnStatusCode :string;
Remarks :string;
RecordStatus :string;

}