import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDeliveryChecklistContext, IDeliveryChecklistResponseItem, IDeliveryChecklistSnapshot, DEFAULT_DELIVERY_CHECKLISTS } from './delivery-checklist.models';
import { DeliveryChecklistService } from './delivery-checklist.service';

@Component({ selector: 'app-delivery-checklist-form', standalone: false, templateUrl: './delivery-checklist-form.component.html' })
export class DeliveryChecklistFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) context!: IDeliveryChecklistContext;
  @Output() saved = new EventEmitter<IDeliveryChecklistSnapshot>();
  @Output() cancelled = new EventEmitter<void>();

  snapshot: IDeliveryChecklistSnapshot | null = null;
  loading = false;
  saving = false;
  evidenceRefreshCount = 0;
  error = '';

  constructor(private readonly checklists: DeliveryChecklistService) {}

  ngOnInit(): void { this.load(); }
  ngOnChanges(changes: SimpleChanges): void { if (changes['context'] && !changes['context'].firstChange) this.load(); }

  load(): void {
    if (!this.context) return;
    this.loading = true;
    this.error = '';
    this.checklists.getOrCreate(this.context).subscribe({
      next: response => this.snapshot = response?.data || null,
      error: () => {
        // A server normally supplies this snapshot. The local defaults keep the
        // required controls understandable if a new tenant has not seeded one.
        this.snapshot = this.defaultSnapshot();
        this.error = 'Checklist template could not be loaded. Delivery remains blocked until the checklist service is available.';
      },
      complete: () => this.loading = false
    });
  }

  responseOptions(item: IDeliveryChecklistResponseItem): { label: string; value: string; disabled?: boolean }[] {
    return [
      { label: 'Pass', value: 'PASS' },
      { label: 'Fail', value: 'FAIL' },
      { label: 'Not Applicable', value: 'NOT_APPLICABLE', disabled: item.AllowsNotApplicable === false || item.NonWaivable === true }
    ];
  }

  updateResponse(item: IDeliveryChecklistResponseItem, code: string): void {
    if (code === 'NOT_APPLICABLE' && (item.AllowsNotApplicable === false || item.NonWaivable === true)) {
      this.error = 'This statutory or non-waivable check cannot be marked Not Applicable.';
      return;
    }
    item.ResponseCode = code as any;
    this.error = '';
    if (code === 'PASS' && item.EvidenceRequired) this.refreshEvidenceCount(item);
  }

  save(): void {
    if (!this.snapshot) return;
    this.error = this.clientValidationError();
    if (this.error) return;
    this.saving = true;
    this.checklists.save(this.context, this.snapshot).subscribe({
      next: response => this.saved.emit(response?.data || this.snapshot!),
      error: error => { this.error = String(error); this.saving = false; },
      complete: () => this.saving = false
    });
  }

  get completeMandatoryCount(): number {
    return this.snapshot?.Items.filter(item => item.Mandatory && this.isSatisfied(item)).length || 0;
  }

  get mandatoryCount(): number { return this.snapshot?.Items.filter(item => item.Mandatory).length || 0; }
  get isReady(): boolean { return !!this.snapshot && !this.clientValidationError(); }

  isSatisfied(item: IDeliveryChecklistResponseItem): boolean {
    if (item.ResponseCode === 'PASS') return !item.EvidenceRequired || Number(item.EvidenceCount || 0) > 0;
    return item.ResponseCode === 'NOT_APPLICABLE' && item.AllowsNotApplicable !== false && item.NonWaivable !== true;
  }

  itemStatus(item: IDeliveryChecklistResponseItem): string {
    if (!item.ResponseCode) return 'Not completed';
    if (item.ResponseCode === 'FAIL') return item.ExceptionApproved && !item.NonWaivable ? 'Exception approved' : 'Failed';
    if (item.ResponseCode === 'NOT_APPLICABLE') return 'Not applicable';
    return item.EvidenceRequired && !item.EvidenceCount ? 'Evidence required' : 'Passed';
  }

  refreshEvidenceCount(item: IDeliveryChecklistResponseItem): void {
    if (!this.snapshot || !item.ResponseId) return;

    this.evidenceRefreshCount++;
    this.checklists.getOrCreate(this.context).subscribe({
      next: response => {
        const persistedItem = response?.data?.Items?.find(candidate => candidate.ResponseId === item.ResponseId);
        item.EvidenceCount = Number(persistedItem?.EvidenceCount || 0);
        this.error = '';
      },
      error: () => {
        this.error = 'The uploaded evidence could not be verified. Try reopening the checklist.';
        this.evidenceRefreshCount--;
      },
      complete: () => this.evidenceRefreshCount--
    });
  }

  private clientValidationError(): string {
    const blocking = this.snapshot?.Items.filter(item => item.Mandatory && !this.isSatisfied(item) && !(item.ResponseCode === 'FAIL' && item.ExceptionApproved && !item.NonWaivable)) || [];
    if (!blocking.length) return '';
    return `Complete all mandatory checks. Outstanding: ${blocking.map(item => item.Name).join(', ')}.`;
  }

  private defaultSnapshot(): IDeliveryChecklistSnapshot {
    const category = String(this.context.AssetCategoryName || '').toUpperCase();
    const key = category.includes('VEHICLE') ? 'VEHICLE' : category.includes('IT') ? 'IT' : category.includes('PLANT') || category.includes('EQUIPMENT') ? 'PLANT' : '';
    const items = (DEFAULT_DELIVERY_CHECKLISTS[key] || []).map(item => ({ ...item, ResponseCode: '' as const, Remarks: '', EvidenceCount: 0 }));
    return { LeaseContractId: this.context.LeaseContractId, LeaseContractAssetId: this.context.LeaseContractAssetId, AssetId: this.context.AssetId, AssetCategoryName: this.context.AssetCategoryName, Status: items.length ? 'NOT_STARTED' : 'NOT_REQUIRED', IsReadyForDelivery: !items.length, MandatoryItemCount: items.filter(item => item.Mandatory).length, CompletedMandatoryItemCount: 0, BlockingReasons: [], Items: items };
  }
}
