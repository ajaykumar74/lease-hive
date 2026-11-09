import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  


import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IRFQ, IRFQLineItem, IRFQPurchaseRequisitionContext } from './rFQ';
import { RFQService } from './rFQ.service';
import { SupplierQuotationService } from '../supplierQuotation/supplierQuotation.service';


@Component({
  selector: 'app-rFQ-edit',
  standalone: false,
  templateUrl: './rFQ-edit.component.html',
  providers: [ MessageService, ConfirmationService]
})
export class RFQEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  rFQ: IRFQ = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierQuotationId: number | null = null;
  isSupplierQuotationLoading: boolean = false;
  isEditable: boolean = false;
  lineItems: IRFQLineItem[] = [];
  eligibleLineItems: IRFQLineItem[] = [];
  currentPurchaseRequisitionId: number | null = null;
  purchaserequisitionidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
rfqstatuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRFQ = {} as IRFQ;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private rFQService: RFQService, 
	private supplierQuotationService: SupplierQuotationService,
	private loggedInUserService : LoggedInUserService,
  private readonly confirmationService: ConfirmationService
	) {
  }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
   this.objMaster = { ...this.rFQ };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RFQNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseRequisitionId: new FormControl(0, [Validators.min(0), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RFQStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IssueDateTime: new FormControl(new Date(), []),
ResponseDueDateTime: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
CommercialTerms: new FormControl('', [Validators.maxLength(2000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionId', 'purchase-requisitions',
      options => this.purchaserequisitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.rfqstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RFQStatusCode');
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
    this.rFQService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.rFQ = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.rFQ };
        this.populateUI(this.rFQ);
        this.lineItems = (this.rFQ.LineItems || []).map(item => ({ ...item }));
        this.currentPurchaseRequisitionId = this.rFQ.PurchaseRequisitionId || null;
        this.isEditable = String(this.rFQ.RFQStatusCode).toUpperCase() === 'DRAFT';
        if (this.currentPurchaseRequisitionId) {
          this.loadPurchaseRequisitionContext(this.currentPurchaseRequisitionId, false);
        }
        if (!this.isEditable) this.editForm.disable({ emitEvent: false });
        this.loadSupplierQuotation();
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  get supplierQuoteActionLabel(): string {
    return this.supplierQuotationId ? 'View Supplier Quote' : 'Generate Supplier Quote';
  }

  private loadSupplierQuotation(): void {
    if (!this.rFQ?.Id) {
      this.supplierQuotationId = null;
      return;
    }

    this.isSupplierQuotationLoading = true;
    this.supplierQuotationService.getLatestActiveForRfq(this.rFQ.Id).subscribe({
      next: response => this.supplierQuotationId = response.data ?? null,
      error: err => this.messageService.showError(err),
      complete: () => { this.isSupplierQuotationLoading = false; }
    });
  }

  openSupplierQuote(): void {
    if (!this.rFQ?.Id) {
      return;
    }

    if (this.supplierQuotationId) {
      this.router.navigate(['/business/procurement/supplier-quotations/edit', this.supplierQuotationId]);
      return;
    }

    this.router.navigate(['/business/procurement/supplier-quotations/create'], {
      queryParams: { rfqId: this.rFQ.Id }
    });
  }

  populateUI(obj: IRFQ): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || null,
ResponseDueDateTime:  obj.ResponseDueDateTime || null,
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

	 this.Caption = "RFQ Details #" + obj.Id;
  } 

  onPurchaseRequisitionChanged(value: number | null): void {
    if (!this.isEditable) return;

    const purchaseRequisitionId = Number(value) || null;
    if (purchaseRequisitionId === this.currentPurchaseRequisitionId) return;
    const applyChange = () => {
      if (purchaseRequisitionId) {
        this.loadPurchaseRequisitionContext(purchaseRequisitionId, true);
      } else {
        this.currentPurchaseRequisitionId = null;
        this.eligibleLineItems = [];
        this.lineItems = [];
        this.editForm.get('BuyingOrganisationId')?.enable({ emitEvent: false });
        this.editForm.get('CurrencyCode')?.enable({ emitEvent: false });
      }
    };

    if (this.lineItems.length > 0) {
      this.confirmationService.confirm({
        key: 'rfq-edit-requisition',
        message: 'Changing the purchase requisition will replace all RFQ items. Continue?',
        header: 'Replace RFQ items?',
        icon: 'pi pi-exclamation-triangle',
        accept: applyChange,
        reject: () => this.editForm.get('PurchaseRequisitionId')?.setValue(this.currentPurchaseRequisitionId, { emitEvent: false })
      });
    } else {
      applyChange();
    }
  }

  onLineItemsChanged(items: IRFQLineItem[]): void {
    this.lineItems = items;
    this.editForm.markAsDirty();
  }

  private loadPurchaseRequisitionContext(purchaseRequisitionId: number, replaceItems: boolean): void {
    this.spinner?.show();
    this.rFQService.getPurchaseRequisitionContext(purchaseRequisitionId).subscribe({
      next: response => {
        const context = response.data;
        if (!context || context.StatusCode?.toUpperCase() !== 'APPROVED') {
          this.messageService?.showError('An RFQ can only be linked to an Approved purchase requisition.');
          this.editForm.get('PurchaseRequisitionId')?.setValue(this.currentPurchaseRequisitionId, { emitEvent: false });
          return;
        }
        this.applyPurchaseRequisitionContext(context, replaceItems);
      },
      error: error => {
        this.messageService?.showError(error);
        this.editForm.get('PurchaseRequisitionId')?.setValue(this.currentPurchaseRequisitionId, { emitEvent: false });
      },
      complete: () => this.spinner?.hide()
    });
  }

  private applyPurchaseRequisitionContext(context: IRFQPurchaseRequisitionContext, replaceItems: boolean): void {
    this.currentPurchaseRequisitionId = context.PurchaseRequisitionId;
    this.eligibleLineItems = (context.LineItems || []).map(item => ({ ...item }));
    this.editForm.patchValue({
      PurchaseRequisitionId: context.PurchaseRequisitionId,
      BuyingOrganisationId: context.BuyingOrganisationId,
      CurrencyCode: context.CurrencyCode
    }, { emitEvent: false });
    this.editForm.get('BuyingOrganisationId')?.disable({ emitEvent: false });
    this.editForm.get('CurrencyCode')?.disable({ emitEvent: false });
    if (replaceItems) {
      this.lineItems = this.eligibleLineItems.map(item => ({ ...item, Id: 0, RowVersionStr: '', Quantity: Number(item.PRQuantity) }));
      this.editForm.markAsDirty();
    }
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/rfqs/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.rFQ = { ...this.objMaster };
	var obj  = this.rFQ;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQNo: obj.RFQNo || '',
PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
BuyingOrganisationId: obj.BuyingOrganisationId || 0,
RFQStatusCode: obj.RFQStatusCode || '',
IssueDateTime:  obj.IssueDateTime || null,
ResponseDueDateTime:  obj.ResponseDueDateTime || null,
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',
RecordStatus: obj.RecordStatus || '',

      }
    );

    this.lineItems = (obj.LineItems || []).map(item => ({ ...item }));
    this.currentPurchaseRequisitionId = obj.PurchaseRequisitionId || null;

    this.editForm.markAsPristine();

    this.editForm.markAsUntouched();
  }



  Save(): void {

        if (!this.isEditable) {
            this.messageService.showError('Issued RFQs cannot be changed without an authorised amendment workflow.');
            return;
        }

        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }

     const formValues = this.editForm.getRawValue();
	 if (String(formValues.RFQStatusCode).toUpperCase() === 'ISSUED' && this.lineItems.length === 0) {
       this.messageService.showError('Add at least one valid RFQ item before issuing the RFQ.');
       return;
     }
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     RFQNo:  formValues.RFQNo || null,
PurchaseRequisitionId:  formValues.PurchaseRequisitionId || 0,
BuyingOrganisationId:  formValues.BuyingOrganisationId || 0,
RFQStatusCode:  formValues.RFQStatusCode || null,
IssueDateTime:  formValues.IssueDateTime || null,
ResponseDueDateTime:  formValues.ResponseDueDateTime || null,
CurrencyCode:  formValues.CurrencyCode || null,
CommercialTerms:  formValues.CommercialTerms || null,
RecordStatus:  formValues.RecordStatus || null,
      LineItems: this.serializeLineItems(),

    } as IRFQ ;

	this.spinner.show();  	   
    this.rFQService.update(this.rFQ.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(RFQ +  'Details Updated sucessfully.');
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

  private serializeLineItems(): IRFQLineItem[] {
    return this.lineItems.map(item => ({
      Id: item.Id || 0,
      RowVersionStr: item.RowVersionStr || '',
      PurchaseRequisitionLineId: item.PurchaseRequisitionLineId,
      Quantity: Number(item.Quantity)
    } as IRFQLineItem));
  }
}
