import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ISupplierInvoiceLine } from './supplierInvoiceLine';
import { SupplierInvoiceLineService } from './supplierInvoiceLine.service';


@Component({
  selector: 'app-supplierInvoiceLine-edit',
  standalone: false,
  templateUrl: './supplierInvoiceLine-edit.component.html',
  providers: [ MessageService]
})
export class SupplierInvoiceLineEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supplierInvoiceLine: ISupplierInvoiceLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierinvoiceidOptions: ISelectItem[] = [];
purchaseorderlineidOptions: ISelectItem[] = [];
goodsreceiptlineidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierInvoiceLine = {} as ISupplierInvoiceLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierInvoiceLineService: SupplierInvoiceLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierInvoiceLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupplierInvoiceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
PurchaseOrderLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
InvoicedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UOMId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UnitPrice: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
LineTotal: new FormControl(0, [Validators.required]),

    });

   this.supplierinvoiceidOptions.push({Text: 'SupplierInvoiceId1', Value: 'SupplierInvoiceId1' });
this.supplierinvoiceidOptions.push({Text: 'SupplierInvoiceId2', Value: 'SupplierInvoiceId2' });
this.purchaseorderlineidOptions.push({Text: 'PurchaseOrderLineId1', Value: 'PurchaseOrderLineId1' });
this.purchaseorderlineidOptions.push({Text: 'PurchaseOrderLineId2', Value: 'PurchaseOrderLineId2' });
this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId1', Value: 'GoodsReceiptLineId1' });
this.goodsreceiptlineidOptions.push({Text: 'GoodsReceiptLineId2', Value: 'GoodsReceiptLineId2' });
this.uomidOptions.push({Text: 'UOMId1', Value: 'UOMId1' });
this.uomidOptions.push({Text: 'UOMId2', Value: 'UOMId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supplierInvoiceLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierInvoiceLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierInvoiceLine };
        this.populateUI(this.supplierInvoiceLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierInvoiceLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierInvoiceId: obj.SupplierInvoiceId || 0,
LineNo: obj.LineNo || 0,
PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
Description: obj.Description || '',
InvoicedQuantity: obj.InvoicedQuantity || 0,
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
 
      }
    );
   
	 this.Caption = "SupplierInvoiceLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supplierInvoiceLine/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierInvoiceLine = { ...this.objMaster };
	var obj  = this.supplierInvoiceLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierInvoiceId: obj.SupplierInvoiceId || 0,
LineNo: obj.LineNo || 0,
PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
Description: obj.Description || '',
InvoicedQuantity: obj.InvoicedQuantity || 0,
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
 
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
     SupplierInvoiceId:  formValues.SupplierInvoiceId || null,
LineNo:  formValues.LineNo || null,
PurchaseOrderLineId:  formValues.PurchaseOrderLineId || null,
GoodsReceiptLineId:  formValues.GoodsReceiptLineId || null,
Description:  formValues.Description || null,
InvoicedQuantity:  formValues.InvoicedQuantity || null,
UOMId:  formValues.UOMId || null,
UnitPrice:  formValues.UnitPrice || null,
TaxAmount:  formValues.TaxAmount || null,
LineTotal:  formValues.LineTotal || null,

    } as ISupplierInvoiceLine ;
	
	this.spinner.show();  	   
    this.supplierInvoiceLineService.update(this.supplierInvoiceLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierInvoiceLine +  'Details Updated sucessfully.');
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
