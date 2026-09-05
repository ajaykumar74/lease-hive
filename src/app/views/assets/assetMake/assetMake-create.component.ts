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
import { IAssetMake } from './assetMake';
import { AssetMakeService } from './assetMake.service';

@Component({
  selector: 'app-assetMake-create',
  standalone: false,
  templateUrl: './assetMake-create.component.html' ,
   providers: [ MessageService]
})
export class AssetMakeCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Make';
  assetMake: IAssetMake = null;
  assetcategoryidOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetMake = {} as IAssetMake;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetMakeService: AssetMakeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetMake };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MakeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MakeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CountryCode: new FormControl('', [Validators.maxLength(0), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetMakeService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetMake = data;
        this.objMaster = { ...this.assetMake };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetMake): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MakeCode: obj.MakeCode || '',
MakeName: obj.MakeName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
CountryCode: obj.CountryCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMakes/create']);
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
    this.assetMake = { ...this.objMaster };
    var obj  = this.assetMake;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MakeCode: obj.MakeCode || '',
MakeName: obj.MakeName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
CountryCode: obj.CountryCode || '',
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
     MakeCode: formValues.MakeCode || null,
MakeName: formValues.MakeName || null,
AssetCategoryId: formValues.AssetCategoryId || 0,
CountryCode: formValues.CountryCode || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetMake ; 
	
	  this.spinner.show(); 
    this.assetMakeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetMake +  'Details Updated sucessfully.');
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



