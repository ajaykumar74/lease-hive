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
import { IAssetMeasureReading } from './assetMeasureReading';
import { AssetMeasureReadingService } from './assetMeasureReading.service';

@Component({
  selector: 'app-assetMeasureReading-create',
  standalone: false,
  templateUrl: './assetMeasureReading-create.component.html' ,
   providers: [ MessageService]
})
export class AssetMeasureReadingCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Measure Reading';
  assetMeasureReading: IAssetMeasureReading = null;
  assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
unitofmeasureidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetMeasureReading = {} as IAssetMeasureReading;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetMeasureReadingService: AssetMeasureReadingService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetMeasureReading };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MeasureCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MeasureName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
UnitOfMeasureId: new FormControl('', [Validators.maxLength(20), ]), 
IsCumulative: new FormControl(false, []),
IsRequired: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.unitofmeasureidOptions.push({Text: 'Text1', Value: 'Text1' });
this.unitofmeasureidOptions.push({Text: 'Text2', Value: 'Text2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetMeasureReadingService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetMeasureReading = data;
        this.objMaster = { ...this.assetMeasureReading };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetMeasureReading): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
MeasureCode: obj.MeasureCode || '',
MeasureName: obj.MeasureName || '',
UnitOfMeasureId: obj.UnitOfMeasureId || '',
IsCumulative:  obj.IsCumulative || false,
IsRequired:  obj.IsRequired || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMeasureReadings/create']);
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
    this.assetMeasureReading = { ...this.objMaster };
    var obj  = this.assetMeasureReading;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
MeasureCode: obj.MeasureCode || '',
MeasureName: obj.MeasureName || '',
UnitOfMeasureId: obj.UnitOfMeasureId || '',
IsCumulative:  obj.IsCumulative || false,
IsRequired:  obj.IsRequired || false,
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
     AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
MeasureCode: formValues.MeasureCode || null,
MeasureName: formValues.MeasureName || null,
UnitOfMeasureId: formValues.UnitOfMeasureId || null,
IsCumulative: formValues.IsCumulative || false,
IsRequired: formValues.IsRequired || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetMeasureReading ; 
	
	  this.spinner.show(); 
    this.assetMeasureReadingService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetMeasureReading +  'Details Updated sucessfully.');
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



