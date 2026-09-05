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
import { IAssetType } from './assetType';
import { AssetTypeService } from './assetType.service';

@Component({
  selector: 'app-assetType-create',
  standalone: false,
  templateUrl: './assetType-create.component.html' ,
   providers: [ MessageService]
})
export class AssetTypeCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Type';
  assetType: IAssetType = null;
  assetcategoryidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetType = {} as IAssetType;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetTypeService: AssetTypeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetCategoryId: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
AssetTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssetTypeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
DefaultUsefulLifeMonths: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
DefaultResidualPercent: new FormControl(0, []),
RequiresSerialNo: new FormControl(false, []),
RequiresRegistrationNo: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {}, 'reference');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetTypeService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetType = data;
        this.objMaster = { ...this.assetType };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetType): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || '',
AssetTypeCode: obj.AssetTypeCode || '',
AssetTypeName: obj.AssetTypeName || '',
DefaultUsefulLifeMonths: obj.DefaultUsefulLifeMonths || 0,
DefaultResidualPercent: obj.DefaultResidualPercent || 0,
RequiresSerialNo:  obj.RequiresSerialNo || false,
RequiresRegistrationNo:  obj.RequiresRegistrationNo || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetTypes/create']);
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
    this.assetType = { ...this.objMaster };
    var obj  = this.assetType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || '',
AssetTypeCode: obj.AssetTypeCode || '',
AssetTypeName: obj.AssetTypeName || '',
DefaultUsefulLifeMonths: obj.DefaultUsefulLifeMonths || 0,
DefaultResidualPercent: obj.DefaultResidualPercent || 0,
RequiresSerialNo:  obj.RequiresSerialNo || false,
RequiresRegistrationNo:  obj.RequiresRegistrationNo || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetCategoryId: formValues.AssetCategoryId || null,
AssetTypeCode: formValues.AssetTypeCode || null,
AssetTypeName: formValues.AssetTypeName || null,
DefaultUsefulLifeMonths: formValues.DefaultUsefulLifeMonths || null,
DefaultResidualPercent: formValues.DefaultResidualPercent || 0,
RequiresSerialNo: formValues.RequiresSerialNo || false,
RequiresRegistrationNo: formValues.RequiresRegistrationNo || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetType ; 
	
	  this.spinner.show(); 
    this.assetTypeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetType +  'Details Updated sucessfully.');
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



