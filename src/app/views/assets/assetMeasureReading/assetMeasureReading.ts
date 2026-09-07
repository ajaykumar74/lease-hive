import { IBase } from "@/shared/IBase";

export interface IAssetMeasureReading extends IBase {
	Id :number;
AssetMeasureReadingId :string;
TenantId :number;
AssetId :number;
AssetMeasureDefinitionId :number;
ReadingValue :number;
ReadingDateTime :Date;
ReadingSourceId :number;
SourceReference :string;
IsVerified : boolean;
RecordedBy :number;

}