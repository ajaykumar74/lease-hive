import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-maintenanceWorkOrderTask-edit',
  standalone: false,
  templateUrl: './maintenanceWorkOrderTask-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceWorkOrderTaskEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  maintenanceWorkOrderTask: IMaintenanceWorkOrderTask = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceworkorderidOptions: ISelectItem[] = [];
taskstatuscodeOptions: ISelectItem[] = [];
completedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceWorkOrderTask = {} as IMaintenanceWorkOrderTask;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceWorkOrderTaskService: MaintenanceWorkOrderTaskService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderTask };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceWorkOrderId', 'maintenance-work-orders',
      options => this.maintenanceworkorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.taskstatuscodeOptions = this.loggedInUserService.getPicklistOptions('TaskStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'CompletedByUserId', 'application-users',
      options => this.completedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.maintenanceWorkOrderTaskService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceWorkOrderTask = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceWorkOrderTask };
        this.populateUI(this.maintenanceWorkOrderTask);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenanceWorkOrderTask Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/work-orders/tasks/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenanceWorkOrderId:  formValues.MaintenanceWorkOrderId || 0,
LineNo:  formValues.LineNo || 0,
TaskCode:  formValues.TaskCode || null,
TaskDescription:  formValues.TaskDescription || null,
MandatoryFlag:  formValues.MandatoryFlag || false,
TaskStatusCode:  formValues.TaskStatusCode || null,
CompletedAt:  formValues.CompletedAt || null,
CompletedByUserId:  formValues.CompletedByUserId || 0,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderTask ;
	
	this.spinner.show();  	   
    this.maintenanceWorkOrderTaskService.update(this.maintenanceWorkOrderTask.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceWorkOrderTask +  'Details Updated sucessfully.');
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
