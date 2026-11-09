import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 
import { finalize, forkJoin } from 'rxjs';


import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IRFQ, IRFQLineItem, IRFQPurchaseRequisitionContext } from './rFQ';
import { RFQService } from './rFQ.service';
import { IPurchaseRequisition } from '../purchaseRequisition/purchaseRequisition';
import { PurchaseRequisitionService } from '../purchaseRequisition/purchaseRequisition.service';

@Component({
  selector: 'app-rFQ-create',
  standalone: false,
  templateUrl: './rFQ-create.component.html' ,
   providers: [ MessageService, ConfirmationService]
})
export class RFQCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);


  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rFQ: IRFQ = null;
  sourceRequisition: IPurchaseRequisition | null = null;
  isFromApprovedRequisition: boolean = false;
  lineItems: IRFQLineItem[] = [];
  eligibleLineItems: IRFQLineItem[] = [];
  currentPurchaseRequisitionId: number | null = null;
  purchaserequisitionidOptions: ISelectItem[] = [];
buyingorganisationidOptions: ISelectItem[] = [];
rfqstatuscodeOptions: ISelectItem[] = [];
  editForm: any; 
  objMaster : IRFQ = {} as IRFQ;

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private activatedRoute: ActivatedRoute,
	private _location: Location, 
	private rFQService: RFQService,
	private purchaseRequisitionService: PurchaseRequisitionService,
	private loggedInUserService : LoggedInUserService,
  private readonly confirmationService: ConfirmationService

  ) {
  }





  ngOnInit(): void {
   this.objMaster = { ...this.rFQ };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
PurchaseRequisitionId: new FormControl(0, [Validators.min(0), Validators.max(2147483647)]),
BuyingOrganisationId: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2147483647)]),
RFQStatusCode: new FormControl('DRAFT', [Validators.required, Validators.maxLength(20), ]),
IssueDateTime: new FormControl(new Date(), []),
ResponseDueDateTime: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
CommercialTerms: new FormControl('', [Validators.maxLength(2000), ]), 

    });
    this.Caption = 'Create RFQ';
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyingOrganisationId', 'organisations',
      options => this.buyingorganisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionId', 'purchase-requisitions',
      options => this.purchaserequisitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.rfqstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RFQStatusCode');
    this.loadRequisitionContext();
  }

  private loadRequisitionContext(): void {
    const purchaseRequisitionId = Number(this.activatedRoute.snapshot.queryParamMap.get('purchaseRequisitionId'));
    if (!Number.isInteger(purchaseRequisitionId) || purchaseRequisitionId <= 0) return;

    this.isLoading = true;
    forkJoin({
      requisition: this.purchaseRequisitionService.getById(purchaseRequisitionId),
      workflow: this.purchaseRequisitionService.getApprovalWorkflow(purchaseRequisitionId)
    }).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: ({ requisition, workflow }) => {
        const source = requisition?.data as IPurchaseRequisition | null;
        if (!source || workflow?.data?.StatusCode !== 'APPROVED') {
          this.messageService?.showError('An RFQ can only be generated from an Approved purchase requisition.');
          return;
        }

        this.sourceRequisition = source;
        this.isFromApprovedRequisition = true;
        this.editForm.patchValue({
          PurchaseRequisitionId: source.Id,
          BuyingOrganisationId: source.BuyingOrganisationId,
          CurrencyCode: source.CurrencyCode,
          RFQStatusCode: 'DRAFT'
        });
        this.loadPurchaseRequisitionContext(source.Id, true);
        this.editForm.get('PurchaseRequisitionId')?.disable({ emitEvent: false });
        this.editForm.get('BuyingOrganisationId')?.disable({ emitEvent: false });
        this.editForm.get('CurrencyCode')?.disable({ emitEvent: false });
        this.editForm.get('RFQStatusCode')?.disable({ emitEvent: false });
      },
      error: error => this.messageService?.showError(error)
    });
  }

  onPurchaseRequisitionChanged(value: number | null): void {
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
        key: 'rfq-create-requisition',
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
          this.messageService?.showError('An RFQ can only be generated from an Approved purchase requisition.');
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
    }
  }

 loadUI(): void {
    this.isLoading = true;    
    this.rFQService.getById(this.selectedId).subscribe({
      next: data => {
        this.rFQ = data;
        this.objMaster = { ...this.rFQ };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
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
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',

      }
    );
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
    else if (key == "Refresh") {
      this.loadUI();
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
IssueDateTime:  obj.IssueDateTime || new Date(),
ResponseDueDateTime:  obj.ResponseDueDateTime || new Date(),
CurrencyCode: obj.CurrencyCode || '',
CommercialTerms: obj.CommercialTerms || '',

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


	const formValues  = this.editForm.getRawValue();
	if (String(formValues.RFQStatusCode).toUpperCase() === 'ISSUED' && this.lineItems.length === 0) {
      this.messageService.showError('Add at least one valid RFQ item before issuing the RFQ.');
      return;
    }
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     RFQNo: formValues.RFQNo || null,
PurchaseRequisitionId: formValues.PurchaseRequisitionId || 0,
BuyingOrganisationId: formValues.BuyingOrganisationId || 0,
RFQStatusCode: formValues.RFQStatusCode || null,
IssueDateTime: formValues.IssueDateTime || null,
ResponseDueDateTime: formValues.ResponseDueDateTime || null,
CurrencyCode: formValues.CurrencyCode || null,
CommercialTerms: formValues.CommercialTerms || null,
RecordStatus: 'Active',
      LineItems: this.serializeLineItems(),
    } as IRFQ ; 

	  this.spinner.show(); 
    this.rFQService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(RFQ +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
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



