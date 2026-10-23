import { IBase } from "@/shared/IBase";

/** The server entity is FeatureDefinition; /api/features remains its public API route. */
export interface IFeatureDefinition extends IBase {
	Id :number;
FeatureId :string;
FeatureCode :string;
FeatureName :string;
RecordStatus :string;

}

/** @deprecated Use IFeatureDefinition. Kept while generated component file names are migrated. */
export type IFeature = IFeatureDefinition;
