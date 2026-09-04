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
import { IMaintenanceSchedule } from './maintenanceSchedule';
import { MaintenanceScheduleService } from './maintenanceSchedule.service';

@Component({
  selector: 'app-maintenanceSchedule-create',
  standalone: false,
  templateUrl: './maintenanceSchedule-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceScheduleCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceSchedule: IMaintenanceSchedule = null;
  assetmaintenanceplanidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
maintenanceplanidOptions: ISelectItem[] = [];
duestatuscodeOptions: ISelectItem[] = [];
plannedorganisationunitidOptions: ISelectItem[] = [];
preferredserviceproviderpartyidOptions: ISelectItem[] = [];
generatedfromcodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceSchedule = {} as IMaintenanceSchedule;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceScheduleService: MaintenanceScheduleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceSchedule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetMaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduleNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
DueDate: new FormControl(new Date(), []),
DueMeasureValue: new FormControl(0, []),
CurrentMeasureValue: new FormControl(0, []),
DueStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PlannedOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PreferredServiceProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GeneratedFromCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceSchedule';
    this.assetmaintenanceplanidOptions.push({Text: 'AssetMaintenancePlanId1', Value: 'AssetMaintenancePlanId1' });
this.assetmaintenanceplanidOptions.push({Text: 'AssetMaintenancePlanId2', Value: 'AssetMaintenancePlanId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId1', Value: 'MaintenancePlanId1' });
this.maintenanceplanidOptions.push({Text: 'MaintenancePlanId2', Value: 'MaintenancePlanId2' });
this.duestatuscodeOptions.push({Text: 'UPCOMING', Value: 'UPCOMING' });
this.duestatuscodeOptions.push({Text: 'DUE', Value: 'DUE' });
this.duestatuscodeOptions.push({Text: 'OVERDUE', Value: 'OVERDUE' });
this.duestatuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.duestatuscodeOptions.push({Text: 'SKIPPED', Value: 'SKIPPED' });
this.plannedorganisationunitidOptions.push({Text: 'PlannedOrganisationUnitId1', Value: 'PlannedOrganisationUnitId1' });
this.plannedorganisationunitidOptions.push({Text: 'PlannedOrganisationUnitId2', Value: 'PlannedOrganisationUnitId2' });
this.preferredserviceproviderpartyidOptions.push({Text: 'PreferredServiceProviderPartyId1', Value: 'PreferredServiceProviderPartyId1' });
this.preferredserviceproviderpartyidOptions.push({Text: 'PreferredServiceProviderPartyId2', Value: 'PreferredServiceProviderPartyId2' });
this.generatedfromcodeOptions.push({Text: 'PLAN', Value: 'PLAN' });
this.generatedfromcodeOptions.push({Text: 'MANUAL', Value: 'MANUAL' });
this.generatedfromcodeOptions.push({Text: 'EVENT', Value: 'EVENT' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceScheduleService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceSchedule = data;
        this.objMaster = { ...this.maintenanceSchedule };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceSchedule): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceSchedules/create']);
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
    this.maintenanceSchedule = { ...this.objMaster };
    var obj  = this.maintenanceSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
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
     AssetMaintenancePlanId: formValues.AssetMaintenancePlanId || 0,
AssetId: formValues.AssetId || 0,
MaintenancePlanId: formValues.MaintenancePlanId || 0,
ScheduleNo: formValues.ScheduleNo || null,
DueDate: formValues.DueDate || null,
DueMeasureValue: formValues.DueMeasureValue || 0,
CurrentMeasureValue: formValues.CurrentMeasureValue || 0,
DueStatusCode: formValues.DueStatusCode || null,
PlannedOrganisationUnitId: formValues.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: formValues.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: formValues.GeneratedFromCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceSchedule ; 
	
	  this.spinner.show(); 
    this.maintenanceScheduleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceSchedule +  'Details Updated sucessfully.');
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



