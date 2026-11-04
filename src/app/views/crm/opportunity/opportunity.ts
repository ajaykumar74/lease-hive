import { IBase } from "@/shared/IBase";

export interface IOpportunity extends IBase {
	Id :number;
OpportunityId :string;
TenantId :number;
LeadId :number;
PartyId :number;
OriginatingOrganisationId :number;
OwnerOrganisationUnitId :number;
OwnerUserId :number;
OpportunityStageId :number;
OpportunityName :string;
EstimatedAmount :number;
CurrencyCode :string;
ProbabilityPct :number;
ExpectedCloseDate :Date;
LostReasonCode :string;
ClosedOn :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date | null;
Description :string;

}

export interface IOpportunityPipelineFilter {
  OrganisationId?: number;
  OwnerUserId?: number;
  PartyId?: number;
  AssetCategoryId?: number;
  ExpectedCloseDate?: Date | null;
  OpportunityStageId?: number;
}

export interface IOpportunityPipelineOption {
  Id: number;
  Name: string;
}

export interface IOpportunityPipelineCard {
  Id: number;
  OpportunityStageId: number;
  OpportunityId: string;
  OpportunityName: string;
  CustomerName: string;
  AssetCategoryId?: number;
  AssetCategoryName: string;
  RequirementSummary: string;
  EstimatedAmount: number;
  CurrencyCode: string;
  ProbabilityPct: number;
  ExpectedCloseDate?: Date | null;
  OwnerUserId: number;
  SalesExecutiveName: string;
  NextFollowUpDate?: Date | null;
  IsFollowUpOverdue: boolean;
  IsDelayed: boolean;
  RowVersionStr: string;
}

export interface IOpportunityPipelineStage {
  Id: number;
  StageCode: string;
  StageName: string;
  IsWon: boolean;
  IsLost: boolean;
  SortOrder: number;
  OpportunityCount: number;
  TotalValue: number;
  TotalValues: IOpportunityPipelineCurrencyValue[];
  Opportunities: IOpportunityPipelineCard[];
}

export interface IOpportunityPipelineCurrencyValue {
  CurrencyCode: string;
  Amount: number;
}

export interface IOpportunityPipelineKpis {
  OpenOpportunities: number;
  TotalPipelineValue: number;
  WeightedPipelineValue: number;
  TotalPipelineValues: IOpportunityPipelineCurrencyValue[];
  WeightedPipelineValues: IOpportunityPipelineCurrencyValue[];
  WonOpportunities: number;
  OverdueFollowUps: number;
}

export interface IOpportunityPipeline {
  Kpis: IOpportunityPipelineKpis;
  Stages: IOpportunityPipelineStage[];
  FilterOptions: {
    Organisations: IOpportunityPipelineOption[];
    SalesExecutives: IOpportunityPipelineOption[];
    Customers: IOpportunityPipelineOption[];
    AssetCategories: IOpportunityPipelineOption[];
  };
}
