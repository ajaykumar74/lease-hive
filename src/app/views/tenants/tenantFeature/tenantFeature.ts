import { IBase } from "@/shared/IBase";

export interface ITenantFeature extends IBase {
	Id :number;
TenantId :number;
FeatureId :number;
IsEnabled : boolean;
EffectiveFrom :Date | string | null;
EffectiveTo :Date | string | null;
TenantName?: string;
FeatureName?: string;

}
