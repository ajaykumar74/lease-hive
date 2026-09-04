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
import { IMaintenanceWorkOrderTask } from './maintenanceWorkOrderTask';
import { MaintenanceWorkOrderTaskService } from './maintenanceWorkOrderTask.service';

@Component({
  selector: 'app-maintenanceWorkOrderTask-create',
  standalone: false,
  templateUrl: './maintenanceWorkOrderTask-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceWorkOrderTaskCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceWorkOrderTask: IMaintenanceWorkOrderTask = null;
  maintenanceworkorderidOptions: ISelectItem[] = [];
taskstatuscodeOptions: ISelectItem[] = [];
completedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceWorkOrderTask = {} as IMaintenanceWorkOrderTask;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceWorkOrderTaskService: MaintenanceWorkOrderTaskService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderTask };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MaintenanceWorkOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
TaskCode: new FormControl('', [Validators.maxLength(20), ]), 
TaskDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
MandatoryFlag: new FormControl(false, [Validators.required]),
TaskStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CompletedAt: new FormControl(new Date(), []),
CompletedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceWorkOrderTask';
    this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.taskstatuscodeOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.taskstatuscodeOptions.push({Text: 'IN_PROGRESS', Value: 'IN_PROGRESS' });
this.taskstatuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.taskstatuscodeOptions.push({Text: 'NOT_REQUIRED', Value: 'NOT_REQUIRED' });
this.completedbyuseridOptions.push({Text: 'CompletedByUserId1', Value: 'CompletedByUserId1' });
this.completedbyuseridOptions.push({Text: 'CompletedByUserId2', Value: 'CompletedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceWorkOrderTaskService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceWorkOrderTask = data;
        this.objMaster = { ...this.maintenanceWorkOrderTask };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceWorkOrderTask): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
TaskCode: obj.TaskCode || '',
TaskDescription: obj.TaskDescription || '',
MandatoryFlag:  obj.MandatoryFlag || false,
TaskStatusCode: obj.TaskStatusCode || '',
CompletedAt:  obj.CompletedAt || new Date(),
CompletedByUserId: obj.CompletedByUserId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceWorkOrderTasks/create']);
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
    this.maintenanceWorkOrderTask = { ...this.objMaster };
    var obj  = this.maintenanceWorkOrderTask;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
TaskCode: obj.TaskCode || '',
TaskDescription: obj.TaskDescription || '',
MandatoryFlag:  obj.MandatoryFlag || false,
TaskStatusCode: obj.TaskStatusCode || '',
CompletedAt:  obj.CompletedAt || new Date(),
CompletedByUserId: obj.CompletedByUserId || 0,
Remarks: obj.Remarks || '',
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
     MaintenanceWorkOrderId: formValues.MaintenanceWorkOrderId || 0,
LineNo: formValues.LineNo || null,
TaskCode: formValues.TaskCode || null,
TaskDescription: formValues.TaskDescription || null,
MandatoryFlag: formValues.MandatoryFlag || false,
TaskStatusCode: formValues.TaskStatusCode || null,
CompletedAt: formValues.CompletedAt || null,
CompletedByUserId: formValues.CompletedByUserId || 0,
Remarks: formValues.Remarks || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderTask ; 
	
	  this.spinner.show(); 
    this.maintenanceWorkOrderTaskService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceWorkOrderTask +  'Details Updated sucessfully.');
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



