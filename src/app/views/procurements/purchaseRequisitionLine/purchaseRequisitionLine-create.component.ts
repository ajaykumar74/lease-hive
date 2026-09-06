import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPurchaseRequisitionLine } from './purchaseRequisitionLine';
import { PurchaseRequisitionLineService } from './purchaseRequisitionLine.service';

@Component({
  selector: 'app-purchaseRequisitionLine-create',
  standalone: false,
  templateUrl: './purchaseRequisitionLine-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseRequisitionLineCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseRequisitionLine: IPurchaseRequisitionLine = null;
  purchaserequisitionidOptions: ISelectItem[] = [];
linetypecodeOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
deliverylocationidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPurchaseRequisitionLine = {} as IPurchaseRequisitionLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private purchaseRequisitionLineService: PurchaseRequisitionLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.purchaseRequisitionLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PurchaseRequisitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LineTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required]),
UOMId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EstimatedUnitCost: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
SpecificationsJson: new FormControl('', [Validators.maxLength(8000), ]), 
RequiredByDate: new FormControl(new Date(), []),
DeliveryLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create PurchaseRequisitionLine';
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DeliveryLocationId', 'locations',
      options => this.deliverylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PurchaseRequisitionId', 'purchase-requisitions',
      options => this.purchaserequisitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'UOMId', 'unit-of-measures',
      options => this.uomidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.linetypecodeOptions = this.loggedInUserService.getPicklistOptions('LineTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.purchaseRequisitionLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.purchaseRequisitionLine = data;
        this.objMaster = { ...this.purchaseRequisitionLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPurchaseRequisitionLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
LineNo: obj.LineNo || 0,
LineTypeCode: obj.LineTypeCode || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
EstimatedUnitCost: obj.EstimatedUnitCost || 0,
CurrencyCode: obj.CurrencyCode || '',
SpecificationsJson: obj.SpecificationsJson || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
DeliveryLocationId: obj.DeliveryLocationId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/requisitions/lines/create']);
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
    this.purchaseRequisitionLine = { ...this.objMaster };
    var obj  = this.purchaseRequisitionLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseRequisitionId: obj.PurchaseRequisitionId || 0,
LineNo: obj.LineNo || 0,
LineTypeCode: obj.LineTypeCode || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
EstimatedUnitCost: obj.EstimatedUnitCost || 0,
CurrencyCode: obj.CurrencyCode || '',
SpecificationsJson: obj.SpecificationsJson || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
DeliveryLocationId: obj.DeliveryLocationId || 0,
 
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
     PurchaseRequisitionId: formValues.PurchaseRequisitionId || 0,
LineNo: formValues.LineNo || 0,
LineTypeCode: formValues.LineTypeCode || null,
AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
Description: formValues.Description || null,
Quantity: formValues.Quantity || 0,
UOMId: formValues.UOMId || 0,
EstimatedUnitCost: formValues.EstimatedUnitCost || 0,
CurrencyCode: formValues.CurrencyCode || null,
SpecificationsJson: formValues.SpecificationsJson || null,
RequiredByDate: formValues.RequiredByDate || null,
DeliveryLocationId: formValues.DeliveryLocationId || 0,

    } as IPurchaseRequisitionLine ; 
	
	  this.spinner.show(); 
    this.purchaseRequisitionLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PurchaseRequisitionLine +  'Details Updated sucessfully.');
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



