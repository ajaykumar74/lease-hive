export type DeliveryChecklistResponse = 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | '';

export interface IDeliveryChecklistTemplateItem {
  Id?: number;
  Name: string;
  Description?: string;
  Mandatory: boolean;
  EvidenceRequired: boolean;
  SortOrder: number;
  Active: boolean;
  AllowsNotApplicable?: boolean;
  NonWaivable?: boolean;
}

export interface IDeliveryChecklistTemplate {
  Id?: number;
  TenantId?: number;
  AssetCategoryId: number;
  ParentAssetCategoryId?: number | null;
  Name: string;
  Version: number;
  Active: boolean;
  Items: IDeliveryChecklistTemplateItem[];
}

export interface IDeliveryChecklistResponseItem extends IDeliveryChecklistTemplateItem {
  ResponseId?: number;
  ResponseCode: DeliveryChecklistResponse;
  Remarks?: string;
  EvidenceCount?: number;
  ExceptionApproved?: boolean;
  ExceptionReference?: string;
}

export interface IDeliveryChecklistSnapshot {
  Id?: number;
  TenantId?: number;
  LeaseContractId: number;
  LeaseContractAssetId: number;
  AssetId: number;
  AssetCategoryId?: number | null;
  AssetCategoryName?: string;
  TemplateId?: number | null;
  TemplateVersion?: number | null;
  Status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE' | 'BLOCKED' | 'NOT_REQUIRED';
  IsReadyForDelivery: boolean;
  MandatoryItemCount: number;
  CompletedMandatoryItemCount: number;
  BlockingReasons: string[];
  Items: IDeliveryChecklistResponseItem[];
}

export interface IDeliveryChecklistContext {
  LeaseContractId: number;
  LeaseContractAssetId: number;
  AssetId: number;
  AssetLabel: string;
  AssetCategoryName?: string;
}

/** Default system templates shown by the API when a tenant has no override. */
export const DEFAULT_DELIVERY_CHECKLISTS: Record<string, IDeliveryChecklistTemplateItem[]> = {
  VEHICLE: [
    { Name: 'Registration and statutory documents', Description: 'Registration, road-worthiness and statutory documents are present and current.', Mandatory: true, EvidenceRequired: true, SortOrder: 10, Active: true, NonWaivable: true },
    { Name: 'Safety equipment', Description: 'Required safety equipment, warning triangle and first-aid provisions have been checked.', Mandatory: true, EvidenceRequired: false, SortOrder: 20, Active: true, AllowsNotApplicable: false },
    { Name: 'Condition handover', Description: 'Exterior, interior and odometer condition has been recorded.', Mandatory: true, EvidenceRequired: true, SortOrder: 30, Active: true, AllowsNotApplicable: false }
  ],
  IT: [
    { Name: 'Asset identity and serial number', Description: 'Asset tag and serial number match the allocation.', Mandatory: true, EvidenceRequired: false, SortOrder: 10, Active: true, NonWaivable: true },
    { Name: 'Functional test', Description: 'The device powers on and completes the agreed functional test.', Mandatory: true, EvidenceRequired: false, SortOrder: 20, Active: true, AllowsNotApplicable: false },
    { Name: 'Accessories and secure handover', Description: 'Charger, accessories and secure configuration are handed over where applicable.', Mandatory: true, EvidenceRequired: false, SortOrder: 30, Active: true, AllowsNotApplicable: true }
  ],
  PLANT: [
    { Name: 'Safety inspection', Description: 'Required safety guards, emergency controls and inspection markings have been checked.', Mandatory: true, EvidenceRequired: true, SortOrder: 10, Active: true, NonWaivable: true },
    { Name: 'Operator documentation', Description: 'Applicable operating manuals and compliance certificates are supplied.', Mandatory: true, EvidenceRequired: true, SortOrder: 20, Active: true, NonWaivable: true },
    { Name: 'Operational test', Description: 'The equipment passed the agreed operational test before handover.', Mandatory: true, EvidenceRequired: false, SortOrder: 30, Active: true, AllowsNotApplicable: false }
  ]
};
