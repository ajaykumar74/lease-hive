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
import { IMaintenanceException } from './maintenanceException';
import { MaintenanceExceptionService } from './maintenanceException.service';

@Component({
  selector: 'app-maintenanceException-create',
  standalone: false,
  templateUrl: './maintenanceException-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceExceptionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceException: IMaintenanceException = null;
  exceptiontypecodeOptions: ISelectItem[] = [];
referencetypecodeOptions: ISelectItem[] = [];
severitycodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceException = {} as IMaintenanceException;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceExceptionService: MaintenanceExceptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceException };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ExceptionNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ExceptionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SeverityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResolvedAt: new FormControl(new Date(), []),

    });
    this.Caption = 'Create MaintenanceException';
    this.exceptiontypecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceExceptionExceptionTypeCode');
this.referencetypecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceExceptionReferenceTypeCode');
this.severitycodeOptions = this.loggedInUserService.getPicklistOptions('SeverityCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssignedToUserId', 'application-users',
      options => this.assignedtouseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceExceptionStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceExceptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceException = data;
        this.objMaster = { ...this.maintenanceException };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceException): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
ExceptionTypeCode: obj.ExceptionTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
SeverityCode: obj.SeverityCode || '',
Reason: obj.Reason || '',
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceExceptions/create']);
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
    this.maintenanceException = { ...this.objMaster };
    var obj  = this.maintenanceException;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
ExceptionTypeCode: obj.ExceptionTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
SeverityCode: obj.SeverityCode || '',
Reason: obj.Reason || '',
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
 
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
     ExceptionNo: formValues.ExceptionNo || null,
ExceptionTypeCode: formValues.ExceptionTypeCode || null,
ReferenceTypeCode: formValues.ReferenceTypeCode || null,
ReferenceId: formValues.ReferenceId || 0,
SeverityCode: formValues.SeverityCode || null,
Reason: formValues.Reason || null,
AssignedToUserId: formValues.AssignedToUserId || 0,
StatusCode: formValues.StatusCode || null,
ResolvedAt: formValues.ResolvedAt || null,
RecordStatus: 'Active',

    } as IMaintenanceException ; 
	
	  this.spinner.show(); 
    this.maintenanceExceptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceException +  'Details Updated sucessfully.');
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



