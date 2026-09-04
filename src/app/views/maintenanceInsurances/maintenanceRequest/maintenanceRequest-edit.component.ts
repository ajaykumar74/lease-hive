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
import { IMaintenanceRequest } from './maintenanceRequest';
import { MaintenanceRequestService } from './maintenanceRequest.service';


@Component({
  selector: 'app-maintenanceRequest-edit',
  standalone: false,
  templateUrl: './maintenanceRequest-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceRequestEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceRequest: IMaintenanceRequest = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceRequestService: MaintenanceRequestService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenancescheduleidOptions.push({Text: 'MaintenanceScheduleId1', Value: 'MaintenanceScheduleId1' });
this.maintenancescheduleidOptions.push({Text: 'MaintenanceScheduleId2', Value: 'MaintenanceScheduleId2' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId1', Value: 'MaintenanceTypeId1' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId2', Value: 'MaintenanceTypeId2' });
this.requestsourcecodeOptions.push({Text: 'SCHEDULE', Value: 'SCHEDULE' });
this.requestsourcecodeOptions.push({Text: 'BREAKDOWN', Value: 'BREAKDOWN' });
this.requestsourcecodeOptions.push({Text: 'INSPECTION', Value: 'INSPECTION' });
this.requestsourcecodeOptions.push({Text: 'CUSTOMER', Value: 'CUSTOMER' });
this.requestsourcecodeOptions.push({Text: 'RECALL', Value: 'RECALL' });
this.requestsourcecodeOptions.push({Text: 'MANUAL', Value: 'MANUAL' });
this.requestedbypartyidOptions.push({Text: 'RequestedByPartyId1', Value: 'RequestedByPartyId1' });
this.requestedbypartyidOptions.push({Text: 'RequestedByPartyId2', Value: 'RequestedByPartyId2' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId1', Value: 'RequestedByUserId1' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId2', Value: 'RequestedByUserId2' });
this.locationidOptions.push({Text: 'LocationId1', Value: 'LocationId1' });
this.locationidOptions.push({Text: 'LocationId2', Value: 'LocationId2' });
this.prioritycodeOptions.push({Text: 'LOW', Value: 'LOW' });
this.prioritycodeOptions.push({Text: 'NORMAL', Value: 'NORMAL' });
this.prioritycodeOptions.push({Text: 'HIGH', Value: 'HIGH' });
this.prioritycodeOptions.push({Text: 'CRITICAL', Value: 'CRITICAL' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'TRIAGED', Value: 'TRIAGED' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'REJECTED', Value: 'REJECTED' });
this.statuscodeOptions.push({Text: 'CONVERTED', Value: 'CONVERTED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
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
    this.maintenanceRequestService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceRequest = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceRequest };
        this.populateUI(this.maintenanceRequest);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenanceRequest Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceRequest/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
MaintenanceScheduleId:  formValues.MaintenanceScheduleId || null,
MaintenanceTypeId:  formValues.MaintenanceTypeId || null,
RequestSourceCode:  formValues.RequestSourceCode || null,
RequestedAt:  formValues.RequestedAt || null,
RequestedByPartyId:  formValues.RequestedByPartyId || null,
RequestedByUserId:  formValues.RequestedByUserId || null,
LocationId:  formValues.LocationId || null,
PriorityCode:  formValues.PriorityCode || null,
ProblemDescription:  formValues.ProblemDescription || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceRequest ;
	
	this.spinner.show();  	   
    this.maintenanceRequestService.update(this.maintenanceRequest.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceRequest +  'Details Updated sucessfully.');
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
