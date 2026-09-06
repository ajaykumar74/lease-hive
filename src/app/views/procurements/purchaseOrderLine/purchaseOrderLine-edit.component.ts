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
import { IPurchaseOrderLine } from './purchaseOrderLine';
import { PurchaseOrderLineService } from './purchaseOrderLine.service';


@Component({
  selector: 'app-purchaseOrderLine-edit',
  standalone: false,
  templateUrl: './purchaseOrderLine-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOrderLineEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  purchaseOrderLine: IPurchaseOrderLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseorderidOptions: ISelectItem[] = [];
purchaserequisitionlineidOptions: ISelectItem[] = [];
supplierquotationlineidOptions: ISelectItem[] = [];
linetypecodeOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOrderLine = {} as IPurchaseOrderLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOrderLineService: PurchaseOrderLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrderLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PurchaseOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
PurchaseRequisitionLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierQuotationLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LineTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
OrderedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UOMId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UnitPrice: new FormControl(0, [Validators.required]),
DiscountAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
LineTotal: new FormControl(0, [Validators.required]),
RequiredByDate: new FormControl(new Date(), []),
SpecificationsJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderId', 'purchase-orders',
      options => this.purchaseorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionLineId', 'purchase-requisition-lines',
      options => this.purchaserequisitionlineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierQuotationLineId', 'supplier-quotation-lines',
      options => this.supplierquotationlineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'UOMId', 'unit-of-measures',
      options => this.uomidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.purchaseOrderLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOrderLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOrderLine };
        this.populateUI(this.purchaseOrderLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOrderLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderId: obj.PurchaseOrderId || 0,
LineNo: obj.LineNo || 0,
PurchaseRequisitionLineId: obj.PurchaseRequisitionLineId || 0,
SupplierQuotationLineId: obj.SupplierQuotationLineId || 0,
LineTypeCode: obj.LineTypeCode || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
Description: obj.Description || '',
OrderedQuantity: obj.OrderedQuantity || 0,
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
DiscountAmount: obj.DiscountAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
RequiredByDate:  obj.RequiredByDate || new Date(),
SpecificationsJson: obj.SpecificationsJson || '',
 
      }
    );
   
	 this.Caption = "PurchaseOrderLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/purchase-orders/lines/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOrderLine = { ...this.objMaster };
	var obj  = this.purchaseOrderLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderId: obj.PurchaseOrderId || 0,
LineNo: obj.LineNo || 0,
PurchaseRequisitionLineId: obj.PurchaseRequisitionLineId || 0,
SupplierQuotationLineId: obj.SupplierQuotationLineId || 0,
LineTypeCode: obj.LineTypeCode || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
Description: obj.Description || '',
OrderedQuantity: obj.OrderedQuantity || 0,
UOMId: obj.UOMId || 0,
UnitPrice: obj.UnitPrice || 0,
DiscountAmount: obj.DiscountAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
RequiredByDate:  obj.RequiredByDate || new Date(),
SpecificationsJson: obj.SpecificationsJson || '',
 
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
     PurchaseOrderId:  formValues.PurchaseOrderId || 0,
LineNo:  formValues.LineNo || 0,
PurchaseRequisitionLineId:  formValues.PurchaseRequisitionLineId || 0,
SupplierQuotationLineId:  formValues.SupplierQuotationLineId || 0,
LineTypeCode:  formValues.LineTypeCode || null,
AssetCategoryId:  formValues.AssetCategoryId || 0,
AssetTypeId:  formValues.AssetTypeId || 0,
Description:  formValues.Description || null,
OrderedQuantity:  formValues.OrderedQuantity || 0,
UOMId:  formValues.UOMId || 0,
UnitPrice:  formValues.UnitPrice || 0,
DiscountAmount:  formValues.DiscountAmount || 0,
TaxAmount:  formValues.TaxAmount || 0,
LineTotal:  formValues.LineTotal || 0,
RequiredByDate:  formValues.RequiredByDate || null,
SpecificationsJson:  formValues.SpecificationsJson || null,

    } as IPurchaseOrderLine ;
	
	this.spinner.show();  	   
    this.purchaseOrderLineService.update(this.purchaseOrderLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOrderLine +  'Details Updated sucessfully.');
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
