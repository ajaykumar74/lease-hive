import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-invoiceMatch-create',
  standalone: false,
  templateUrl: './invoiceMatch-create.component.html' ,
   providers: [ MessageService]
})
export class InvoiceMatchCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  invoiceMatch: IInvoiceMatch = null;
  supplierinvoiceidOptions: ISelectItem[] = [];
purchaseorderidOptions: ISelectItem[] = [];
goodsreceiptidOptions: ISelectItem[] = [];
matchtypecodeOptions: ISelectItem[] = [];
matchedbyOptions: ISelectItem[] = [];
matchresultcodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInvoiceMatch = {} as IInvoiceMatch;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private invoiceMatchService: InvoiceMatchService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.invoiceMatch };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
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
    this.Caption = 'Create InvoiceMatch';
    this.supplierinvoiceidOptions.push({Text: 'SupplierInvoiceId1', Value: 'SupplierInvoiceId1' });
this.supplierinvoiceidOptions.push({Text: 'SupplierInvoiceId2', Value: 'SupplierInvoiceId2' });
this.purchaseorderidOptions.push({Text: 'PurchaseOrderId1', Value: 'PurchaseOrderId1' });
this.purchaseorderidOptions.push({Text: 'PurchaseOrderId2', Value: 'PurchaseOrderId2' });
this.goodsreceiptidOptions.push({Text: 'GoodsReceiptId1', Value: 'GoodsReceiptId1' });
this.goodsreceiptidOptions.push({Text: 'GoodsReceiptId2', Value: 'GoodsReceiptId2' });
this.matchtypecodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchTypeCode');
this.matchedbyOptions.push({Text: 'MatchedBy1', Value: 'MatchedBy1' });
this.matchedbyOptions.push({Text: 'MatchedBy2', Value: 'MatchedBy2' });
this.matchresultcodeOptions = this.loggedInUserService.getPicklistOptions('InvoiceMatchMatchResultCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.invoiceMatchService.getById(this.selectedId).subscribe({
      next: data => {
        this.invoiceMatch = data;
        this.objMaster = { ...this.invoiceMatch };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
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
    else if (key == "Refresh") {
      this.loadUI();
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     SupplierInvoiceId: formValues.SupplierInvoiceId || 0,
PurchaseOrderId: formValues.PurchaseOrderId || 0,
GoodsReceiptId: formValues.GoodsReceiptId || 0,
MatchTypeCode: formValues.MatchTypeCode || null,
MatchedOn: formValues.MatchedOn || null,
MatchedBy: formValues.MatchedBy || 0,
QuantityVariance: formValues.QuantityVariance || 0,
AmountVariance: formValues.AmountVariance || 0,
TolerancePassed: formValues.TolerancePassed || false,
MatchResultCode: formValues.MatchResultCode || null,

    } as IInvoiceMatch ; 
	
	  this.spinner.show(); 
    this.invoiceMatchService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InvoiceMatch +  'Details Updated sucessfully.');
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



