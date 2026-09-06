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
import { IPurchaseRequisitionLine } from './purchaseRequisitionLine';
import { PurchaseRequisitionLineService } from './purchaseRequisitionLine.service';

@Component({
  selector: 'app-purchaseRequisitionLine-create',
  standalone: false,
  templateUrl: './purchaseRequisitionLine-create.component.html' ,
   providers: [ MessageService]
})
export class PurchaseRequisitionLineCreateComponent implements OnInit {

   
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
    this.purchaserequisitionidOptions.push({Text: 'PurchaseRequisitionId1', Value: 'PurchaseRequisitionId1' });
this.purchaserequisitionidOptions.push({Text: 'PurchaseRequisitionId2', Value: 'PurchaseRequisitionId2' });
this.linetypecodeOptions.push({Text: 'ASSET', Value: 'ASSET' });
this.linetypecodeOptions.push({Text: 'GOODS', Value: 'GOODS' });
this.linetypecodeOptions.push({Text: 'SERVICE', Value: 'SERVICE' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId1', Value: 'AssetCategoryId1' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId2', Value: 'AssetCategoryId2' });
this.assettypeidOptions.push({Text: 'AssetTypeId1', Value: 'AssetTypeId1' });
this.assettypeidOptions.push({Text: 'AssetTypeId2', Value: 'AssetTypeId2' });
this.uomidOptions.push({Text: 'UOMId1', Value: 'UOMId1' });
this.uomidOptions.push({Text: 'UOMId2', Value: 'UOMId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId1', Value: 'DeliveryLocationId1' });
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId2', Value: 'DeliveryLocationId2' });

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
      this.router.navigate(['/purchaseRequisitionLines/create']);
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
LineNo: formValues.LineNo || null,
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



