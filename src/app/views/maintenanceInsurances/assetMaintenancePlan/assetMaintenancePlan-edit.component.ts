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
import { IAssetMaintenancePlan } from './assetMaintenancePlan';
import { AssetMaintenancePlanService } from './assetMaintenancePlan.service';


@Component({
  selector: 'app-assetMaintenancePlan-edit',
  standalone: false,
  templateUrl: './assetMaintenancePlan-edit.component.html',
  providers: [ MessageService]
})
export class AssetMaintenancePlanEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetMaintenancePlan: IAssetMaintenancePlan = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
maintenanceplanidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetMaintenancePlan = {} as IAssetMaintenancePlan;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetMaintenancePlanService: AssetMaintenancePlanService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetMaintenancePlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId1', Value: 'MaintenancePlanId1' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId2', Value: 'MaintenancePlanId2' });
this.statuscodeOptions.push({Text: 'ACTIVE', Value: 'ACTIVE' });
this.statuscodeOptions.push({Text: 'SUSPENDED', Value: 'SUSPENDED' });
this.statuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetMaintenancePlanService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetMaintenancePlan = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetMaintenancePlan };
        this.populateUI(this.assetMaintenancePlan);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetMaintenancePlan Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMaintenancePlan/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
MaintenancePlanId:  formValues.MaintenancePlanId || null,
StartDate:  formValues.StartDate || null,
EndDate:  formValues.EndDate || null,
BaselineDate:  formValues.BaselineDate || null,
BaselineMeasureValue:  formValues.BaselineMeasureValue || null,
OverrideIntervalDays:  formValues.OverrideIntervalDays || null,
OverrideMeasureValue:  formValues.OverrideMeasureValue || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetMaintenancePlan ;
	
	this.spinner.show();  	   
    this.assetMaintenancePlanService.update(this.assetMaintenancePlan.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetMaintenancePlan +  'Details Updated sucessfully.');
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
