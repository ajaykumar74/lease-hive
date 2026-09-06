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
import { IInvoiceMatch } from './invoiceMatch';
import { InvoiceMatchService } from './invoiceMatch.service';


@Component({
  selector: 'app-invoiceMatch-edit',
  standalone: false,
  templateUrl: './invoiceMatch-edit.component.html',
  providers: [ MessageService]
})
export class InvoiceMatchEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  invoiceMatch: IInvoiceMatch = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierinvoiceidOptions: ISelectItem[] = [];
purchaseorderidOptions: ISelectItem[] = [];
goodsreceiptidOptions: ISelectItem[] = [];
matchtypecodeOptions: ISelectItem[] = [];
matchedbyOptions: ISelectItem[] = [];
matchresultcodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInvoiceMatch = {} as IInvoiceMatch;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private invoiceMatchService: InvoiceMatchService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.invoiceMatch };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupplierInvoiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseOrderId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MatchTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MatchedOn: new FormControl(new Date(), [Validators.required]),
MatchedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
QuantityVariance: new FormControl(0, [Validators.required]),
AmountVariance: new FormControl(0, [Validators.required]),
TolerancePassed: new FormControl(false, [Validators.required]),
MatchResultCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'GoodsReceiptId', 'goods-receipts',
      options => this.goodsreceiptidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MatchedBy', 'application-users',
      options => this.matchedbyOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderId', 'purchase-orders',
      options => this.purchaseorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierInvoiceId', 'supplier-invoices',
      options => this.supplierinvoiceidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.matchtypecodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchTypeCode');
this.matchresultcodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchResultCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.invoiceMatchService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.invoiceMatch = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.invoiceMatch };
        this.populateUI(this.invoiceMatch);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInvoiceMatch): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierInvoiceId: obj.SupplierInvoiceId || 0,
PurchaseOrderId: obj.PurchaseOrderId || 0,
GoodsReceiptId: obj.GoodsReceiptId || 0,
MatchTypeCode: obj.MatchTypeCode || '',
MatchedOn:  obj.MatchedOn || new Date(),
MatchedBy: obj.MatchedBy || 0,
QuantityVariance: obj.QuantityVariance || 0,
AmountVariance: obj.AmountVariance || 0,
TolerancePassed:  obj.TolerancePassed || false,
MatchResultCode: obj.MatchResultCode || '',
 
      }
    );
   
	 this.Caption = "InvoiceMatch Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/invoice-matching/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.invoiceMatch = { ...this.objMaster };
	var obj  = this.invoiceMatch;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierInvoiceId: obj.SupplierInvoiceId || 0,
PurchaseOrderId: obj.PurchaseOrderId || 0,
GoodsReceiptId: obj.GoodsReceiptId || 0,
MatchTypeCode: obj.MatchTypeCode || '',
MatchedOn:  obj.MatchedOn || new Date(),
MatchedBy: obj.MatchedBy || 0,
QuantityVariance: obj.QuantityVariance || 0,
AmountVariance: obj.AmountVariance || 0,
TolerancePassed:  obj.TolerancePassed || false,
MatchResultCode: obj.MatchResultCode || '',
 
      }
    );
   
    this.editForm.reset();
  }



  Save(): void {
  
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     SupplierInvoiceId:  formValues.SupplierInvoiceId || 0,
PurchaseOrderId:  formValues.PurchaseOrderId || 0,
GoodsReceiptId:  formValues.GoodsReceiptId || 0,
MatchTypeCode:  formValues.MatchTypeCode || null,
MatchedOn:  formValues.MatchedOn || null,
MatchedBy:  formValues.MatchedBy || 0,
QuantityVariance:  formValues.QuantityVariance || 0,
AmountVariance:  formValues.AmountVariance || 0,
TolerancePassed:  formValues.TolerancePassed || false,
MatchResultCode:  formValues.MatchResultCode || null,

    } as IInvoiceMatch ;
	
	this.spinner.show();  	   
    this.invoiceMatchService.update(this.invoiceMatch.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InvoiceMatch +  'Details Updated sucessfully.');
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
