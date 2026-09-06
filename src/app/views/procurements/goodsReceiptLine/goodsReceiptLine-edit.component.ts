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
import { IGoodsReceiptLine } from './goodsReceiptLine';
import { GoodsReceiptLineService } from './goodsReceiptLine.service';


@Component({
  selector: 'app-goodsReceiptLine-edit',
  standalone: false,
  templateUrl: './goodsReceiptLine-edit.component.html',
  providers: [ MessageService]
})
export class GoodsReceiptLineEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  goodsReceiptLine: IGoodsReceiptLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  goodsreceiptidOptions: ISelectItem[] = [];
purchaseorderlineidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
inspectionstatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IGoodsReceiptLine = {} as IGoodsReceiptLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private goodsReceiptLineService: GoodsReceiptLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.goodsReceiptLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
GoodsReceiptId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseOrderLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ReceivedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AcceptedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RejectedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UOMId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InspectionRequired: new FormControl(false, [Validators.required]),
InspectionStatusCode: new FormControl('', [Validators.maxLength(20), ]), 
RejectionReason: new FormControl('', [Validators.maxLength(100), ]), 

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'GoodsReceiptId', 'goods-receipts',
      options => this.goodsreceiptidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseOrderLineId', 'purchase-order-lines',
      options => this.purchaseorderlineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'UOMId', 'unit-of-measures',
      options => this.uomidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.inspectionstatuscodeOptions = this.loggedInUserService.getPicklistOptions('GoodsReceiptLineInspectionStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.goodsReceiptLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.goodsReceiptLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.goodsReceiptLine };
        this.populateUI(this.goodsReceiptLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IGoodsReceiptLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptId: obj.GoodsReceiptId || 0,
PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
LineNo: obj.LineNo || 0,
ReceivedQuantity: obj.ReceivedQuantity || 0,
AcceptedQuantity: obj.AcceptedQuantity || 0,
RejectedQuantity: obj.RejectedQuantity || 0,
UOMId: obj.UOMId || 0,
InspectionRequired:  obj.InspectionRequired || false,
InspectionStatusCode: obj.InspectionStatusCode || '',
RejectionReason: obj.RejectionReason || '',
 
      }
    );
   
	 this.Caption = "GoodsReceiptLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/goods-receipts/lines/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.goodsReceiptLine = { ...this.objMaster };
	var obj  = this.goodsReceiptLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptId: obj.GoodsReceiptId || 0,
PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
LineNo: obj.LineNo || 0,
ReceivedQuantity: obj.ReceivedQuantity || 0,
AcceptedQuantity: obj.AcceptedQuantity || 0,
RejectedQuantity: obj.RejectedQuantity || 0,
UOMId: obj.UOMId || 0,
InspectionRequired:  obj.InspectionRequired || false,
InspectionStatusCode: obj.InspectionStatusCode || '',
RejectionReason: obj.RejectionReason || '',
 
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
     GoodsReceiptId:  formValues.GoodsReceiptId || 0,
PurchaseOrderLineId:  formValues.PurchaseOrderLineId || 0,
LineNo:  formValues.LineNo || 0,
ReceivedQuantity:  formValues.ReceivedQuantity || 0,
AcceptedQuantity:  formValues.AcceptedQuantity || 0,
RejectedQuantity:  formValues.RejectedQuantity || 0,
UOMId:  formValues.UOMId || 0,
InspectionRequired:  formValues.InspectionRequired || false,
InspectionStatusCode:  formValues.InspectionStatusCode || null,
RejectionReason:  formValues.RejectionReason || null,

    } as IGoodsReceiptLine ;
	
	this.spinner.show();  	   
    this.goodsReceiptLineService.update(this.goodsReceiptLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(GoodsReceiptLine +  'Details Updated sucessfully.');
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
