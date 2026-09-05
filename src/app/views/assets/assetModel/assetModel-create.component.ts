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
import { IAssetModel } from './assetModel';
import { AssetModelService } from './assetModel.service';

@Component({
  selector: 'app-assetModel-create',
  standalone: false,
  templateUrl: './assetModel-create.component.html' ,
   providers: [ MessageService]
})
export class AssetModelCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Model';
  assetModel: IAssetModel = null;
  assetmakeidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetModel = {} as IAssetModel;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetModelService: AssetModelService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetModel };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetMakeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ModelCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ModelName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
VariantName: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ModelYearFrom: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
ModelYearTo: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetMakeId', 'asset-makes',
      options => this.assetmakeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetModelService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetModel = data;
        this.objMaster = { ...this.assetModel };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetModel): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMakeId: obj.AssetMakeId || 0,
AssetTypeId: obj.AssetTypeId || 0,
ModelCode: obj.ModelCode || '',
ModelName: obj.ModelName || '',
VariantName: obj.VariantName || '',
ModelYearFrom: obj.ModelYearFrom || 0,
ModelYearTo: obj.ModelYearTo || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetModels/create']);
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
    this.assetModel = { ...this.objMaster };
    var obj  = this.assetModel;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMakeId: obj.AssetMakeId || 0,
AssetTypeId: obj.AssetTypeId || 0,
ModelCode: obj.ModelCode || '',
ModelName: obj.ModelName || '',
VariantName: obj.VariantName || '',
ModelYearFrom: obj.ModelYearFrom || 0,
ModelYearTo: obj.ModelYearTo || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     AssetMakeId: formValues.AssetMakeId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
ModelCode: formValues.ModelCode || null,
ModelName: formValues.ModelName || null,
VariantName: formValues.VariantName || null,
ModelYearFrom: formValues.ModelYearFrom || 0,
ModelYearTo: formValues.ModelYearTo || 0,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: 'Active',

    } as IAssetModel ; 
	
	  this.spinner.show(); 
    this.assetModelService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetModel +  'Details Updated sucessfully.');
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



