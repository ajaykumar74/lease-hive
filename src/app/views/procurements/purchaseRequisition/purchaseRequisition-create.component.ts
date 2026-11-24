import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 
import { catchError, forkJoin, of } from 'rxjs';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { CurrencyDefaultService } from '@/shared/currency-default.service';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPurchaseRequisition } from './purchaseRequisition';
import { PurchaseRequisitionService } from './purchaseRequisition.service';
import { IPurchaseRequisitionLine } from '../purchaseRequisitionLine/purchaseRequisitionLine';
import { IQuoteAsset } from '@/views/crm/quoteAsset/quoteAsset';
import { QuoteAssetService } from '@/views/crm/quoteAsset/quoteAsset.service';

@Component({
  selector: 'app-purchaseRequisition-create',
  standalone: false,
  templateUrl: './purchaseRequisition-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseRequisitionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);


  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseRequisition: IPurchaseRequisition = null;
  buyingorganisationidOptions: ISelectItem[] = [];
requestingorganisationunitidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
purchaserequisitionstatusidOptions: ISelectItem[] = [];
sourcereferencetypeOptions: ISelectItem[] = [];
sourceReferenceOptions: ISelectItem[] = [];
linetypecodeOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
quoteAssetItemsLoading = false;
isSourceReferenceLocked = false;
quotationReferenceLabel = '';

  editForm: any; 
  objMaster : IPurchaseRequisition = {} as IPurchaseRequisition;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private route: ActivatedRoute,
	private _location: Location, 
	private purchaseRequisitionService: PurchaseRequisitionService,
	private quoteAssetService: QuoteAssetService,
	private loggedInUserService : LoggedInUserService,
  private currencyDefaultService: CurrencyDefaultService

  ) {
  }





  ngOnInit(): void {
   this.objMaster = { ...this.purchaseRequisition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PRNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RequestingOrganisationUnitId: new FormControl(this.getLoggedInOrganisationUnitId(), [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(this.getLoggedInUserId(), [Validators.required, Validators.min(1), Validators.max(2147483647)]),
PurchaseRequisitionStatusId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RequisitionDate: new FormControl(new Date(), [Validators.required]),
RequiredByDate: new FormControl(new Date(), []),
SourceReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
SourceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
EstimatedTotal: new FormControl(0, []),
Justification: new FormControl('', [Validators.maxLength(250), ]), 
LineItems: this.fb.array([], Validators.required),

    });
    this.Caption = 'Create Purchase Requisition';
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionStatusId', 'purchase-requisition-statuses',
      options => this.setPurchaseRequisitionStatusOptions(options), error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByUserId', 'application-users',
      options => this.requestedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestingOrganisationUnitId', 'organisation-units',
      options => this.requestingorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcereferencetypeOptions = this.loggedInUserService.getPicklistOptions('PurchaseRequisitionSourceReferenceType');
this.applySourceReferenceContext();
this.loadLineItemOptions();

  }

  private applySourceReferenceContext(): void {
    const sourceReferenceType = this.route.snapshot.queryParamMap.get('sourceRefType')?.trim();
    const sourceReferenceId = Number(this.route.snapshot.queryParamMap.get('sourceRefId'));
    const currencyCode = this.route.snapshot.queryParamMap.get('currencyCode')?.trim();

    if (sourceReferenceType && Number.isInteger(sourceReferenceId) && sourceReferenceId > 0) {
      this.isSourceReferenceLocked = true;
      this.quotationReferenceLabel = sourceReferenceType.toUpperCase() === 'QUOTE'
        ? `Quotation reference: ${sourceReferenceId}`
        : `${sourceReferenceType} reference: ${sourceReferenceId}`;
      this.editForm.patchValue({
        SourceReferenceType: sourceReferenceType,
        SourceReferenceId: sourceReferenceId,
        CurrencyCode: currencyCode || this.editForm.get('CurrencyCode')?.value
      });

      if (sourceReferenceType.toUpperCase() === 'QUOTE') {
        this.loggedInUserService.getEntityLookupOptions('quotes', sourceReferenceId).subscribe({
          next: options => this.sourceReferenceOptions = options,
          error: error => this.showLookupError(error)
        });
      }

      this.editForm.get('SourceReferenceType')?.disable({ emitEvent: false });
      this.editForm.get('SourceReferenceId')?.disable({ emitEvent: false });

      if (sourceReferenceType.toUpperCase() === 'QUOTE') this.addQuoteAssetLineItems(sourceReferenceId, currencyCode);
    }
  }

  private setPurchaseRequisitionStatusOptions(options: ISelectItem[]): void {
    this.purchaserequisitionstatusidOptions = options;
    const statusControl = this.editForm.get('PurchaseRequisitionStatusId');
    if (statusControl?.value) return;

    const draft = options.find(option => {
      const text = String(option.Text || '').trim().toUpperCase();
      const code = `${option.Value || ''} ${option.Category || ''}`.trim().toUpperCase();
      return text === 'DRAFT' || text.endsWith(' - DRAFT') || /(^|\s|-)DRAFT$/.test(code);
    });
    if (draft) statusControl?.setValue(draft.Value);
  }

  private getLoggedInUserId(): number {
    const userId = Number(this.loggedInUserService.loggedInUser?.UserId);
    return Number.isInteger(userId) && userId > 0 ? userId : 0;
  }

  private getLoggedInOrganisationUnitId(): number {
    const user = this.loggedInUserService.loggedInUser as Record<string, any> | null;
    const organisation = user?.['OrganisationData'] ?? user?.['Organisation'] ?? user?.['DefaultOrganisation'];
    const candidates = [
      organisation?.['OrganisationUnitId'],
      organisation?.['DefaultOrganisationUnitId'],
      organisation?.['Id'],
      user?.['DefaultOrganisationUnitId']
    ];
    const organisationUnitId = candidates.map(Number).find(id => Number.isInteger(id) && id > 0);
    return organisationUnitId ?? 0;
  }

  private addQuoteAssetLineItems(quoteId: number, currencyCode?: string): void {
    const tenantId = this.loggedInUserService.loggedInUser?.Tenant?.Id;
    const conditions = [
      { DBName: 'QuoteId', Value: String(quoteId), DataType: DataType.Int, Operator: Operator.EqualTo }
    ];
    if (tenantId) conditions.unshift({ DBName: 'TenantId', Value: String(tenantId), DataType: DataType.Int, Operator: Operator.EqualTo });

    this.quoteAssetItemsLoading = true;
    forkJoin({
      quoteAssetResponse: this.quoteAssetService.search({ Skip: 0, Take: 500, SortBy: 'Id', IsDescending: false, Conditions: conditions }),
      assetMakes: this.loggedInUserService.getEntityLookupOptions('asset-makes').pipe(catchError(() => of([]))),
      assetModels: this.loggedInUserService.getEntityLookupOptions('asset-models').pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ quoteAssetResponse, assetMakes, assetModels }) => {
        const quoteAssets = ((quoteAssetResponse?.data?.Records || []) as IQuoteAsset[])
          .sort((left, right) => (left.LineNo || 0) - (right.LineNo || 0));
        quoteAssets.forEach(asset => this.addLineItem({
          LineNo: asset.LineNo,
          LineTypeCode: 'ASSET',
          Description: this.getQuoteAssetDescription(asset, assetMakes, assetModels),
          Quantity: asset.Quantity || 1,
          EstimatedUnitCost: asset.UnitAssetCost || 0,
          CurrencyCode: currencyCode || this.editForm.get('CurrencyCode')?.value || this.currencyDefaultService.getDefaultCurrencyCode(),
          RequiredByDate: this.editForm.get('RequiredByDate')?.value,
          AssetCategoryId: asset.AssetCategoryId || 0,
          AssetTypeId: asset.AssetTypeId || 0,
          AssetMakeId: asset.AssetMakeId || 0,
          AssetModelId: asset.AssetModelId || 0,
          SpecificationsJson: JSON.stringify({ QuoteAssetId: asset.Id, AssetMakeId: asset.AssetMakeId || null, AssetModelId: asset.AssetModelId || null })
        }));
        this.recalculateLineItems();
      },
      error: error => this.messageService?.showError(error),
      complete: () => this.quoteAssetItemsLoading = false
    });
  }

  private getQuoteAssetDescription(asset: IQuoteAsset, assetMakes: ISelectItem[], assetModels: ISelectItem[]): string {
    const make = this.getLookupName(assetMakes, asset.AssetMakeId);
    const model = this.getLookupName(assetModels, asset.AssetModelId);
    return [make, model].filter(Boolean).join(' ') || asset.Description || `Quote asset ${asset.LineNo}`;
  }

  private getLookupName(options: ISelectItem[], id: number): string {
    const displayText = options.find(option => Number(option.Id ?? option.Value) === Number(id))?.Text || '';
    const name = displayText.includes(' - ') ? displayText.substring(displayText.indexOf(' - ') + 3) : displayText;
    return name.replace(/\s*\/\s*/g, ' ').replace(/\s+/g, ' ').trim();
  }

 loadUI(): void {
    this.isLoading = true;    
    this.purchaseRequisitionService.getById(this.selectedId).subscribe({
      next: data => {
        this.purchaseRequisition = data;
        this.objMaster = { ...this.purchaseRequisition };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPurchaseRequisition): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',

      }
    );
    this.setLineItems(obj.LineItems || []);
  }

  get lineItems(): FormArray<FormGroup> {
    return this.editForm.get('LineItems') as FormArray<FormGroup>;
  }

  addLineItem(lineItem?: Partial<IPurchaseRequisitionLine>): void {
    const line = this.fb.group({
      Id: new FormControl(lineItem?.Id || 0),
      RowVersionStr: new FormControl(lineItem?.RowVersionStr || ''),
      PurchaseRequisitionId: new FormControl(lineItem?.PurchaseRequisitionId || 0),
      LineNo: new FormControl(lineItem?.LineNo || this.lineItems.length + 1),
      LineTypeCode: new FormControl(lineItem?.LineTypeCode || '', [Validators.required, Validators.maxLength(20)]),
      Description: new FormControl(lineItem?.Description || '', [Validators.required, Validators.maxLength(100)]),
      Quantity: new FormControl(lineItem?.Quantity || 1, [Validators.required, Validators.min(1)]),
      UOMId: new FormControl(lineItem?.UOMId || 1, [Validators.min(1)]),
      EstimatedUnitCost: new FormControl(lineItem?.EstimatedUnitCost || 0, [Validators.required, Validators.min(0)]),
      CurrencyCode: new FormControl(lineItem?.CurrencyCode || this.currencyDefaultService.getDefaultCurrencyCode(this.editForm.get('CurrencyCode')?.value)),
      SpecificationsJson: new FormControl(lineItem?.SpecificationsJson || ''),
      RequiredByDate: new FormControl(lineItem?.RequiredByDate ? new Date(lineItem.RequiredByDate) : null),
      DeliveryLocationId: new FormControl(lineItem?.DeliveryLocationId || 0),
      AssetCategoryId: new FormControl(lineItem?.AssetCategoryId || 0),
       AssetTypeId: new FormControl(lineItem?.AssetTypeId || 0),
       AssetMakeId: new FormControl(lineItem?.AssetMakeId || 0),
       AssetModelId: new FormControl(lineItem?.AssetModelId || 0)
    });
    line.valueChanges.subscribe(() => this.recalculateLineItems());
    this.lineItems.push(line);
    if (!lineItem) {
      this.lineItems.markAsDirty();
      this.editForm.markAsDirty();
    }
    this.recalculateLineItems();
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.lineItems.controls.forEach((line, lineIndex) => line.get('LineNo')?.setValue(lineIndex + 1, { emitEvent: false }));
    this.lineItems.markAsDirty();
    this.editForm.markAsDirty();
    this.recalculateLineItems();
  }

  private loadLineItemOptions(): void {
    this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode');
    if (!this.linetypecodeOptions.length) {
      this.loggedInUserService.loadPicklistCache().subscribe({
        next: () => this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode'),
        error: error => this.showLookupError(error)
      });
    }
    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({
      next: options => this.uomidOptions = options,
      error: error => this.showLookupError(error)
    });
  }

  private showLookupError(error: unknown): void {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    const message = typeof error === 'string' ? error : typeof response?.error === 'string'
      ? response.error : response?.error?.message || response?.error?.Message || response?.message || 'Unable to load purchase-requisition options.';
    setTimeout(() => this.messageService?.showError(message));
  }

  private setLineItems(lineItems: IPurchaseRequisitionLine[]): void {
    this.lineItems.clear();
    lineItems.forEach(lineItem => this.addLineItem(lineItem));
    this.recalculateLineItems();
  }

  private recalculateLineItems(): void {
    const estimatedTotal = this.lineItems.getRawValue().reduce((total: number, line: any) =>
      total + (Number(line.Quantity) * Number(line.EstimatedUnitCost)), 0);
    this.editForm.patchValue({ EstimatedTotal: estimatedTotal }, { emitEvent: false });
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/requisitions/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.purchaseRequisition = { ...this.objMaster };
    var obj  = this.purchaseRequisition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PRNo: obj.PRNo || '',
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: obj.RequestingOrganisationUnitId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
PurchaseRequisitionStatusId: obj.PurchaseRequisitionStatusId || 0,
RequisitionDate:  obj.RequisitionDate || new Date(),
RequiredByDate:  obj.RequiredByDate || new Date(),
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',

      }
    );
    this.setLineItems(this.objMaster.LineItems || []);
  } 

  Save(): void {    

        if (this.quoteAssetItemsLoading) {
            this.messageService.showError('Quote assets are still loading. Please wait before saving.');
            return;
        }

        if (!this.editForm.valid || this.lineItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	


	const formValues  = this.editForm.getRawValue();
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     PRNo: formValues.PRNo || null,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
RequestingOrganisationUnitId: formValues.RequestingOrganisationUnitId || 0,
RequestedByUserId: formValues.RequestedByUserId || 0,
PurchaseRequisitionStatusId: formValues.PurchaseRequisitionStatusId || 0,
RequisitionDate: formValues.RequisitionDate || null,
RequiredByDate: formValues.RequiredByDate || null,
SourceReferenceType: formValues.SourceReferenceType || null,
SourceReferenceId: formValues.SourceReferenceId || 0,
CurrencyCode: formValues.CurrencyCode || null,
EstimatedTotal: formValues.EstimatedTotal || 0,
Justification: formValues.Justification || null,
LineItems: this.lineItems.getRawValue().map((line: any) => ({ ...line, PurchaseRequisitionId: 0 })),
RecordStatus: 'Active',
    } as IPurchaseRequisition ; 

	  this.spinner.show(); 
    this.purchaseRequisitionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PurchaseRequisition +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



