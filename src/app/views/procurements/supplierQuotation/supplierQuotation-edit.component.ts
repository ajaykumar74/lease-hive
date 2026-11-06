import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ISupplierQuotation } from './supplierQuotation';
import { SupplierQuotationService } from './supplierQuotation.service';
import { finalize } from 'rxjs';
import { SupplierAwardService } from '../supplierAward/supplierAward.service';


@Component({
  selector: 'app-supplierQuotation-edit',
  standalone: false,
  templateUrl: './supplierQuotation-edit.component.html',
  styleUrls: ['./supplierQuotation-status-workflow.component.css'],
  providers: [ MessageService]
})
export class SupplierQuotationEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  supplierQuotation: ISupplierQuotation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierAwardId: number | null = null;
  isSupplierAwardLoading: boolean = false;
  rfqidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
quotationstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierQuotation = {} as ISupplierQuotation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierQuotationService: SupplierQuotationService, 
	private supplierAwardService: SupplierAwardService,
	private loggedInUserService : LoggedInUserService
	) {
  }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
   this.objMaster = { ...this.supplierQuotation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RFQId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
SupplierQuoteNo: new FormControl('', [Validators.maxLength(80), ]), 
VersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
QuoteDate: new FormControl(new Date(), [Validators.required]),
ValidUntil: new FormControl(new Date(), []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subtotal: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
TotalAmount: new FormControl(0, [Validators.required]),
PaymentTermCode: new FormControl('', [Validators.maxLength(20), ]), 
DeliveryDays: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
QuotationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'RFQId', 'rfqs',
      options => this.rfqidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'supplier-parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.quotationstatuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierQuotationQuotationStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supplierQuotationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierQuotation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierQuotation };
        this.populateUI(this.supplierQuotation);
        this.loadSupplierAward();
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierQuotation): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierQuoteNo: obj.SupplierQuoteNo || '',
VersionNo: obj.VersionNo || 0,
QuoteDate:  obj.QuoteDate || null,
ValidUntil:  obj.ValidUntil || null,
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryDays: obj.DeliveryDays || 0,
QuotationStatusCode: obj.QuotationStatusCode || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

	 this.Caption = "SupplierQuotation Details #" + obj.Id;
     this.applyEditability();
     // Loading and disabling the workflow-controlled status must not be treated as a user edit.
     this.editForm.markAsPristine();
     this.editForm.markAsUntouched();
  } 

  private applyEditability(): void {
    if (this.quotationStatusCode === 'DRAFT') {
      this.editForm.enable({ emitEvent: false });
    } else {
      this.editForm.disable({ emitEvent: false });
    }
    this.editForm.get('QuotationStatusCode')?.disable({ emitEvent: false });
  }

  get quotationStatusCode(): string {
    return (this.supplierQuotation?.QuotationStatusCode || '').trim().toUpperCase();
  }

  get quotationStatusLabel(): string {
    return this.formatQuotationStatus(this.quotationStatusCode || 'DRAFT');
  }

  get quotationStatusToneClass(): string {
    switch (this.quotationStatusCode) {
      case 'SUBMITTED': return 'is-submitted';
      case 'ACCEPTED': return 'is-accepted';
      case 'REJECTED': return 'is-rejected';
      default: return 'is-draft';
    }
  }

  get quotationStatusIconClass(): string {
    switch (this.quotationStatusCode) {
      case 'SUBMITTED': return 'pi pi-send';
      case 'ACCEPTED': return 'pi pi-check-circle';
      case 'REJECTED': return 'pi pi-times-circle';
      default: return 'pi pi-file-edit';
    }
  }

  get canSubmitQuotation(): boolean {
    return this.quotationStatusCode === 'DRAFT' && !!this.supplierQuotation?.Id && !!this.permission?.CanUpdate;
  }

  get hasUnsavedQuotationChanges(): boolean {
    if (!this.supplierQuotation || !this.editForm) return false;

    const values = this.editForm.getRawValue();
    const numericFields = ['RFQId', 'SupplierPartyId', 'VersionNo', 'Subtotal', 'TaxAmount', 'TotalAmount', 'DeliveryDays'];
    const dateFields = ['QuoteDate', 'ValidUntil'];
    const fields = [
      'RFQId', 'SupplierPartyId', 'SupplierQuoteNo', 'VersionNo', 'QuoteDate', 'ValidUntil',
      'CurrencyCode', 'Subtotal', 'TaxAmount', 'TotalAmount', 'PaymentTermCode', 'DeliveryDays',
      'QuotationStatusCode', 'RecordStatus'
    ];

    return fields.some(field => {
      const currentValue = values[field];
      const originalValue = (this.supplierQuotation as any)[field];
      if (numericFields.includes(field)) return Number(currentValue || 0) !== Number(originalValue || 0);
      if (dateFields.includes(field)) return this.toDateOnly(currentValue) !== this.toDateOnly(originalValue);
      return String(currentValue ?? '').trim() !== String(originalValue ?? '').trim();
    });
  }

  get canDecideQuotation(): boolean {
    return this.quotationStatusCode === 'SUBMITTED' && !!this.supplierQuotation?.Id && !!this.permission?.CanUpdate;
  }

  get canCreateSupplierAward(): boolean {
    return this.quotationStatusCode === 'ACCEPTED' && !!this.supplierQuotation?.Id && !!this.permission?.CanUpdate;
  }

  get supplierAwardActionLabel(): string {
    return this.supplierAwardId ? 'View Supplier Award' : 'Create Supplier Award';
  }

  private loadSupplierAward(): void {
    if (!this.supplierQuotation?.Id) {
      this.supplierAwardId = null;
      return;
    }

    this.isSupplierAwardLoading = true;
    this.supplierAwardService.getLatestForSupplierQuotation(this.supplierQuotation.Id).subscribe({
      next: response => this.supplierAwardId = response.data ?? null,
      error: error => this.messageService.showError(error),
      complete: () => { this.isSupplierAwardLoading = false; }
    });
  }

  openSupplierAward(): void {
    if (!this.canCreateSupplierAward) return;

    if (this.supplierAwardId) {
      this.router.navigate(['/business/procurement/awards/edit', this.supplierAwardId]);
      return;
    }

    this.router.navigate(['/business/procurement/awards/create'], {
      queryParams: { supplierQuotationId: this.supplierQuotation.Id }
    });
  }

  get quotationStatusHelperText(): string {
    switch (this.quotationStatusCode) {
      case 'SUBMITTED': return 'This supplier quote is ready for a direct acceptance or rejection decision.';
      case 'ACCEPTED': return 'This supplier quote has been accepted.';
      case 'REJECTED': return 'This supplier quote has been rejected.';
      default: return 'Save any changes, then submit this supplier quote for a decision.';
    }
  }

  quotationStepClass(step: number): string {
    if (this.quotationStatusCode === 'SUBMITTED') return step === 1 ? 'is-complete' : step === 2 ? 'is-active' : '';
    if (['ACCEPTED', 'REJECTED'].includes(this.quotationStatusCode)) return step < 3 ? 'is-complete' : 'is-active';
    return step === 1 ? 'is-active' : '';
  }

  transitionStatus(statusCode: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED'): void {
    if (this.isLoading || !this.supplierQuotation?.Id) return;
    if (this.hasUnsavedQuotationChanges) {
      this.messageService.showError('Save the supplier quotation changes before changing its status.');
      return;
    }

    this.isLoading = true;
    this.spinner.show();
    this.supplierQuotationService.transitionStatus(this.supplierQuotation.Id, statusCode, this.supplierQuotation.RowVersionStr)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.spinner.hide();
      }))
      .subscribe({
        next: response => {
          this.messageService.showSuccess(response.Message);
          this.loadUI();
        },
        error: error => this.messageService.showError(error)
      });
  }

  private formatQuotationStatus(status: string): string {
    return status.replace(/[_-]+/g, ' ').toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
  }

  private toDateOnly(value: unknown): string {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 10);
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/supplier-quotations/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierQuotation = { ...this.objMaster };
	var obj  = this.supplierQuotation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierQuoteNo: obj.SupplierQuoteNo || '',
VersionNo: obj.VersionNo || 0,
QuoteDate:  obj.QuoteDate || null,
ValidUntil:  obj.ValidUntil || null,
CurrencyCode: obj.CurrencyCode || '',
Subtotal: obj.Subtotal || 0,
TaxAmount: obj.TaxAmount || 0,
TotalAmount: obj.TotalAmount || 0,
PaymentTermCode: obj.PaymentTermCode || '',
DeliveryDays: obj.DeliveryDays || 0,
QuotationStatusCode: obj.QuotationStatusCode || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

    this.editForm.markAsPristine();

    this.editForm.markAsUntouched();
  }



  Save(): void {

        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

     const formValues = this.editForm.getRawValue();
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     RFQId:  formValues.RFQId || 0,
SupplierPartyId:  formValues.SupplierPartyId || 0,
SupplierQuoteNo:  formValues.SupplierQuoteNo || null,
VersionNo:  formValues.VersionNo || 0,
QuoteDate:  formValues.QuoteDate || null,
ValidUntil:  formValues.ValidUntil || null,
CurrencyCode:  formValues.CurrencyCode || null,
Subtotal:  formValues.Subtotal || 0,
TaxAmount:  formValues.TaxAmount || 0,
TotalAmount:  formValues.TotalAmount || 0,
PaymentTermCode:  formValues.PaymentTermCode || null,
DeliveryDays:  formValues.DeliveryDays || 0,
QuotationStatusCode:  formValues.QuotationStatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ISupplierQuotation ;

	this.spinner.show();  	   
    this.supplierQuotationService.update(this.supplierQuotation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierQuotation +  'Details Updated sucessfully.');
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
