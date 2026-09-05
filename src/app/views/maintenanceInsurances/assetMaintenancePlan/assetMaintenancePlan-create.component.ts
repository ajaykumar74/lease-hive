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
import { IAssetMaintenancePlan } from './assetMaintenancePlan';
import { AssetMaintenancePlanService } from './assetMaintenancePlan.service';

@Component({
  selector: 'app-assetMaintenancePlan-create',
  standalone: false,
  templateUrl: './assetMaintenancePlan-create.component.html' ,
   providers: [ MessageService]
})
export class AssetMaintenancePlanCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetMaintenancePlan: IAssetMaintenancePlan = null;
  assetidOptions: ISelectItem[] = [];
maintenanceplanidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetMaintenancePlan = {} as IAssetMaintenancePlan;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetMaintenancePlanService: AssetMaintenancePlanService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetMaintenancePlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StartDate: new FormControl(new Date(), [Validators.required]),
EndDate: new FormControl(new Date(), []),
BaselineDate: new FormControl(new Date(), []),
BaselineMeasureValue: new FormControl(0, []),
OverrideIntervalDays: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OverrideMeasureValue: new FormControl(0, []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetMaintenancePlan';
    this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId1', Value: 'MaintenancePlanId1' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId2', Value: 'MaintenancePlanId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('AssetMaintenancePlanStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetMaintenancePlanService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetMaintenancePlan = data;
        this.objMaster = { ...this.assetMaintenancePlan };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetMaintenancePlan): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
BaselineDate:  obj.BaselineDate || new Date(),
BaselineMeasureValue: obj.BaselineMeasureValue || 0,
OverrideIntervalDays: obj.OverrideIntervalDays || 0,
OverrideMeasureValue: obj.OverrideMeasureValue || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMaintenancePlans/create']);
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
    this.assetMaintenancePlan = { ...this.objMaster };
    var obj  = this.assetMaintenancePlan;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
BaselineDate:  obj.BaselineDate || new Date(),
BaselineMeasureValue: obj.BaselineMeasureValue || 0,
OverrideIntervalDays: obj.OverrideIntervalDays || 0,
OverrideMeasureValue: obj.OverrideMeasureValue || 0,
StatusCode: obj.StatusCode || '',
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId: formValues.AssetId || 0,
MaintenancePlanId: formValues.MaintenancePlanId || 0,
StartDate: formValues.StartDate || null,
EndDate: formValues.EndDate || null,
BaselineDate: formValues.BaselineDate || null,
BaselineMeasureValue: formValues.BaselineMeasureValue || 0,
OverrideIntervalDays: formValues.OverrideIntervalDays || 0,
OverrideMeasureValue: formValues.OverrideMeasureValue || 0,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetMaintenancePlan ; 
	
	  this.spinner.show(); 
    this.assetMaintenancePlanService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetMaintenancePlan +  'Details Updated sucessfully.');
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



