import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { CurrencyDefaultService } from '@/shared/currency-default.service';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPurchaseRequisition } from './purchaseRequisition';
import { PurchaseRequisitionService } from './purchaseRequisition.service';
import { IPurchaseRequisitionLine } from '../purchaseRequisitionLine/purchaseRequisitionLine';
import { IPurchaseRequisitionApprovalWorkflow } from './purchaseRequisition';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-purchaseRequisition-edit',
  standalone: false,
  templateUrl: './purchaseRequisition-edit.component.html',
  styleUrls: ['./purchaseRequisition-approval-workflow.component.css'],
  providers: [ MessageService]
})
export class PurchaseRequisitionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  purchaseRequisition: IPurchaseRequisition = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  approvalWorkflow: IPurchaseRequisitionApprovalWorkflow | null = null;
  approvalRemarks: string = '';
  buyingorganisationidOptions: ISelectItem[] = [];
requestingorganisationunitidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
purchaserequisitionstatusidOptions: ISelectItem[] = [];
sourcereferencetypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];
linetypecodeOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseRequisition = {} as IPurchaseRequisition;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseRequisitionService: PurchaseRequisitionService, 
	private loggedInUserService : LoggedInUserService,
  private currencyDefaultService: CurrencyDefaultService
	) {
  }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
   this.objMaster = { ...this.purchaseRequisition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PRNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RequestingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
PurchaseRequisitionStatusId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RequisitionDate: new FormControl(new Date(), [Validators.required]),
RequiredByDate: new FormControl(new Date(), []),
SourceReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
SourceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
EstimatedTotal: new FormControl(0, []),
Justification: new FormControl('', [Validators.maxLength(250), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LineItems: this.fb.array([], Validators.required),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionStatusId', 'purchase-requisition-statuses',
      options => this.purchaserequisitionstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByUserId', 'application-users',
      options => this.requestedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestingOrganisationUnitId', 'organisation-units',
      options => this.requestingorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.sourcereferencetypeOptions = this.loggedInUserService.getPicklistOptions('PurchaseRequisitionSourceReferenceType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
this.loadLineItemOptions();

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.purchaseRequisitionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseRequisition = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseRequisition };
        this.populateUI(this.purchaseRequisition);
        this.loadApprovalWorkflow();
      },
      error: err => { this.messageService.showSuccess(err); },
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
RequisitionDate:  obj.RequisitionDate || null,
RequiredByDate:  obj.RequiredByDate || null,
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
RecordStatus: obj.RecordStatus || '',

      }
    );
    this.setLineItems(obj.LineItems || []);

	 this.Caption = "Purchase Requisition Details #" + obj.Id;
  } 

  private loadApprovalWorkflow(): void {
    this.purchaseRequisitionService.getApprovalWorkflow(this.selectedId).subscribe({
      next: response => {
        this.approvalWorkflow = response.data;
        this.applyEditability();
      },
      error: error => this.messageService.showError(error)
    });
  }

  private applyEditability(): void {
    if (!this.editForm || !this.approvalWorkflow) return;
    if (this.approvalWorkflow.IsEditable) {
      this.editForm.enable({ emitEvent: false });
    } else {
      this.editForm.disable({ emitEvent: false });
    }
    // Workflow transitions control this value; requisition editing must not bypass approval.
    this.editForm.get('PurchaseRequisitionStatusId')?.disable({ emitEvent: false });
  }

  get workflowStatusLabel(): string {
    return this.formatWorkflowStatus(this.approvalWorkflow?.StatusCode || this.approvalWorkflow?.ApprovalStatus);
  }

  get workflowToneClass(): string {
    switch (this.approvalWorkflow?.StatusCode) {
      case 'APPROVED': return 'is-approved';
      case 'PENDING_APPROVAL': return 'is-pending';
      case 'RETURNED': return 'is-returned';
      case 'REJECTED': return 'is-rejected';
      default: return 'is-draft';
    }
  }

  get workflowIconClass(): string {
    switch (this.approvalWorkflow?.StatusCode) {
      case 'APPROVED': return 'pi pi-check-circle';
      case 'PENDING_APPROVAL': return 'pi pi-clock';
      case 'RETURNED': return 'pi pi-reply';
      case 'REJECTED': return 'pi pi-times-circle';
      default: return 'pi pi-file-edit';
    }
  }

  get pendingApproverLabel(): string {
    if (this.approvalWorkflow?.PendingApprovers?.length) return this.approvalWorkflow.PendingApprovers.join(', ');
    return this.approvalWorkflow?.StatusCode === 'PENDING_APPROVAL' ? 'No matching approver configured' : 'Not awaiting approval';
  }

  get workflowHelperText(): string {
    switch (this.approvalWorkflow?.StatusCode) {
      case 'PENDING_APPROVAL': return 'Submitted and waiting for the assigned approver to make a decision.';
      case 'APPROVED': return 'Approved requisitions can be used for downstream purchase order creation.';
      case 'RETURNED': return 'Returned for correction. Update the requisition and submit it again.';
      case 'REJECTED': return 'This requisition was rejected. Review the decision history for details.';
      default: return 'Complete the requisition details, then submit it for approval.';
    }
  }

  get canGenerateRfq(): boolean {
    return this.approvalWorkflow?.StatusCode === 'APPROVED' && !!this.purchaseRequisition?.Id;
  }

  workflowStepClass(step: number): string {
    const status = this.approvalWorkflow?.StatusCode;
    if (status === 'PENDING_APPROVAL') return step === 1 ? 'is-complete' : step === 2 ? 'is-active' : '';
    if (['APPROVED', 'RETURNED', 'REJECTED'].includes(status || '')) return step < 3 ? 'is-complete' : 'is-active';
    return step === 1 ? 'is-active' : '';
  }

  private formatWorkflowStatus(status?: string): string {
    return (status || 'Draft')
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  submitForApproval(): void {
    if (!this.approvalWorkflow?.CanSubmit || this.isLoading) return;
    this.isLoading = true;
    this.spinner.show();
    this.purchaseRequisitionService.submitForApproval(this.selectedId).pipe(finalize(() => {
      this.isLoading = false;
      this.spinner.hide();
    })).subscribe({
      next: response => {
        this.messageService.showSuccess(response.data.Message);
        this.loadUI();
      },
      error: error => this.messageService.showError(error)
    });
  }

  generateRfq(): void {
    if (!this.canGenerateRfq) return;

    this.router.navigate(['/business/procurement/rfqs/create'], {
      queryParams: { purchaseRequisitionId: this.purchaseRequisition.Id }
    });
  }

  approvalAction(actionCode: 'APPROVE' | 'REJECT' | 'RETURN'): void {
    if (!this.approvalWorkflow?.CanCurrentUserAction || this.isLoading) return;
    if ((actionCode === 'REJECT' || actionCode === 'RETURN') && !this.approvalRemarks.trim()) {
      this.messageService.showError('Remarks are required when returning or rejecting a purchase requisition.');
      return;
    }
    this.isLoading = true;
    this.spinner.show();
    this.purchaseRequisitionService.approvalAction(this.selectedId, actionCode, this.approvalRemarks.trim()).pipe(finalize(() => {
      this.isLoading = false;
      this.spinner.hide();
    })).subscribe({
      next: response => {
        this.approvalRemarks = '';
        this.messageService.showSuccess(response.data.Message);
        this.loadUI();
      },
      error: error => this.messageService.showError(error)
    });
  }

  get lineItems(): FormArray<FormGroup> {
    return this.editForm.get('LineItems') as FormArray<FormGroup>;
  }

  addLineItem(lineItem?: Partial<IPurchaseRequisitionLine>): void {
    const line = this.fb.group({
      Id: new FormControl(lineItem?.Id || 0), RowVersionStr: new FormControl(lineItem?.RowVersionStr || ''),
      PurchaseRequisitionId: new FormControl(lineItem?.PurchaseRequisitionId || this.selectedId),
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
      AssetCategoryId: new FormControl(lineItem?.AssetCategoryId || 0), AssetTypeId: new FormControl(lineItem?.AssetTypeId || 0)
    });
    line.valueChanges.subscribe(() => this.recalculateLineItems());
    this.lineItems.push(line);
    if (!lineItem) { this.lineItems.markAsDirty(); this.editForm.markAsDirty(); }
    this.recalculateLineItems();
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.lineItems.controls.forEach((line, lineIndex) => line.get('LineNo')?.setValue(lineIndex + 1, { emitEvent: false }));
    this.lineItems.markAsDirty(); this.editForm.markAsDirty(); this.recalculateLineItems();
  }

  private loadLineItemOptions(): void {
    this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode');
    if (!this.linetypecodeOptions.length) this.loggedInUserService.loadPicklistCache().subscribe({
      next: () => this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode'), error: error => this.showLookupError(error)
    });
    this.loggedInUserService.getEntityLookupOptions('unit-of-measures').subscribe({ next: options => this.uomidOptions = options, error: error => this.showLookupError(error) });
  }

  private showLookupError(error: unknown): void {
    const response = error as { error?: { message?: string; Message?: string } | string; message?: string };
    const message = typeof error === 'string' ? error : typeof response?.error === 'string' ? response.error : response?.error?.message || response?.error?.Message || response?.message || 'Unable to load purchase-requisition options.';
    setTimeout(() => this.messageService?.showError(message));
  }

  private setLineItems(lineItems: IPurchaseRequisitionLine[]): void { this.lineItems.clear(); lineItems.forEach(lineItem => this.addLineItem(lineItem)); this.recalculateLineItems(); }
  private recalculateLineItems(): void {
    const estimatedTotal = this.lineItems.getRawValue().reduce((total: number, line: any) => total + (Number(line.Quantity) * Number(line.EstimatedUnitCost)), 0);
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
RequisitionDate:  obj.RequisitionDate || null,
RequiredByDate:  obj.RequiredByDate || null,
SourceReferenceType: obj.SourceReferenceType || '',
SourceReferenceId: obj.SourceReferenceId || 0,
CurrencyCode: obj.CurrencyCode || '',
EstimatedTotal: obj.EstimatedTotal || 0,
Justification: obj.Justification || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

    this.setLineItems(this.objMaster.LineItems || []);
  }



  Save(): void {

        if (!this.approvalWorkflow?.IsEditable) {
            this.messageService.showError('Only Draft or Returned purchase requisitions can be edited.');
            return;
        }

        if (!this.editForm.valid || this.lineItems.length === 0) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

     const formValues = this.editForm.getRawValue(); 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PRNo:  formValues.PRNo || null,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
RequestingOrganisationUnitId:  formValues.RequestingOrganisationUnitId || 0,
RequestedByUserId:  formValues.RequestedByUserId || 0,
PurchaseRequisitionStatusId:  formValues.PurchaseRequisitionStatusId || 0,
RequisitionDate:  formValues.RequisitionDate || null,
RequiredByDate:  formValues.RequiredByDate || null,
SourceReferenceType:  formValues.SourceReferenceType || null,
SourceReferenceId:  formValues.SourceReferenceId || 0,
CurrencyCode:  formValues.CurrencyCode || null,
EstimatedTotal:  formValues.EstimatedTotal || 0,
Justification:  formValues.Justification || null,
LineItems: this.lineItems.getRawValue().map((line: any) => ({ ...line, PurchaseRequisitionId: this.purchaseRequisition.Id })),
RecordStatus:  formValues.RecordStatus || null,

    } as IPurchaseRequisition ;

	this.spinner.show();  	   
    this.purchaseRequisitionService.update(this.purchaseRequisition.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseRequisition +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
