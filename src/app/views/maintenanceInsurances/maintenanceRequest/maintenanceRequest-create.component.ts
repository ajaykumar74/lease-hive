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
import { IMaintenanceRequest } from './maintenanceRequest';
import { MaintenanceRequestService } from './maintenanceRequest.service';

@Component({
  selector: 'app-maintenanceRequest-create',
  standalone: false,
  templateUrl: './maintenanceRequest-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceRequestCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceRequest: IMaintenanceRequest = null;
  assetidOptions: ISelectItem[] = [];
maintenancescheduleidOptions: ISelectItem[] = [];
maintenancetypeidOptions: ISelectItem[] = [];
requestsourcecodeOptions: ISelectItem[] = [];
requestedbypartyidOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
prioritycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceRequest = {} as IMaintenanceRequest;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceRequestService: MaintenanceRequestService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceScheduleId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequestSourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedAt: new FormControl(new Date(), [Validators.required]),
RequestedByPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PriorityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProblemDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceRequest';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceScheduleId', 'maintenance-schedules',
      options => this.maintenancescheduleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceTypeId', 'maintenance-types',
      options => this.maintenancetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.requestsourcecodeOptions = this.loggedInUserService.getPicklistOptions('RequestSourceCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByPartyId', 'parties',
      options => this.requestedbypartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByUserId', 'application-users',
      options => this.requestedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LocationId', 'locations',
      options => this.locationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.prioritycodeOptions = this.loggedInUserService.getPicklistOptions('PriorityCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceRequestStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceRequestService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceRequest = data;
        this.objMaster = { ...this.maintenanceRequest };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceRequest): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
RequestSourceCode: obj.RequestSourceCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
RequestedByPartyId: obj.RequestedByPartyId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
LocationId: obj.LocationId || 0,
PriorityCode: obj.PriorityCode || '',
ProblemDescription: obj.ProblemDescription || '',
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceRequests/create']);
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
    this.maintenanceRequest = { ...this.objMaster };
    var obj  = this.maintenanceRequest;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
RequestSourceCode: obj.RequestSourceCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
RequestedByPartyId: obj.RequestedByPartyId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
LocationId: obj.LocationId || 0,
PriorityCode: obj.PriorityCode || '',
ProblemDescription: obj.ProblemDescription || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId: formValues.AssetId || 0,
MaintenanceScheduleId: formValues.MaintenanceScheduleId || 0,
MaintenanceTypeId: formValues.MaintenanceTypeId || 0,
RequestSourceCode: formValues.RequestSourceCode || null,
RequestedAt: formValues.RequestedAt || null,
RequestedByPartyId: formValues.RequestedByPartyId || 0,
RequestedByUserId: formValues.RequestedByUserId || 0,
LocationId: formValues.LocationId || 0,
PriorityCode: formValues.PriorityCode || null,
ProblemDescription: formValues.ProblemDescription || null,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceRequest ; 
	
	  this.spinner.show(); 
    this.maintenanceRequestService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceRequest +  'Details Updated sucessfully.');
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



