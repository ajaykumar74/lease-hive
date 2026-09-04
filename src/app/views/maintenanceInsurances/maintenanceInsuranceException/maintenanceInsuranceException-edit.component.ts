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
import { IMaintenanceInsuranceException } from './maintenanceInsuranceException';
import { MaintenanceInsuranceExceptionService } from './maintenanceInsuranceException.service';


@Component({
  selector: 'app-maintenanceInsuranceException-edit',
  standalone: false,
  templateUrl: './maintenanceInsuranceException-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceInsuranceExceptionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceInsuranceException: IMaintenanceInsuranceException = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  domaincodeOptions: ISelectItem[] = [];
exceptiontypecodeOptions: ISelectItem[] = [];
referencetypecodeOptions: ISelectItem[] = [];
severitycodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceInsuranceException = {} as IMaintenanceInsuranceException;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceInsuranceExceptionService: MaintenanceInsuranceExceptionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceInsuranceException };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ExceptionNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
DomainCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExceptionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SeverityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResolvedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.domaincodeOptions.push({Text: 'MAINTENANCE', Value: 'MAINTENANCE' });
this.domaincodeOptions.push({Text: 'INSURANCE', Value: 'INSURANCE' });
this.exceptiontypecodeOptions.push({Text: 'COVER_GAP', Value: 'COVER_GAP' });
this.exceptiontypecodeOptions.push({Text: 'EXPIRY', Value: 'EXPIRY' });
this.exceptiontypecodeOptions.push({Text: 'CLAIM_DELAY', Value: 'CLAIM_DELAY' });
this.exceptiontypecodeOptions.push({Text: 'DOCUMENT', Value: 'DOCUMENT' });
this.exceptiontypecodeOptions.push({Text: 'HANDOFF', Value: 'HANDOFF' });
this.referencetypecodeOptions.push({Text: 'ASSET', Value: 'ASSET' });
this.referencetypecodeOptions.push({Text: 'POLICY', Value: 'POLICY' });
this.referencetypecodeOptions.push({Text: 'CLAIM', Value: 'CLAIM' });
this.referencetypecodeOptions.push({Text: 'WORK_ORDER', Value: 'WORK_ORDER' });
this.severitycodeOptions.push({Text: 'INFO', Value: 'INFO' });
this.severitycodeOptions.push({Text: 'WARN', Value: 'WARN' });
this.severitycodeOptions.push({Text: 'ERROR', Value: 'ERROR' });
this.severitycodeOptions.push({Text: 'CRITICAL', Value: 'CRITICAL' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'ASSIGNED', Value: 'ASSIGNED' });
this.statuscodeOptions.push({Text: 'RESOLVED', Value: 'RESOLVED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
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
    this.maintenanceInsuranceExceptionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceInsuranceException = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceInsuranceException };
        this.populateUI(this.maintenanceInsuranceException);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceInsuranceException): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
DomainCode: obj.DomainCode || '',
ExceptionTypeCode: obj.ExceptionTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
SeverityCode: obj.SeverityCode || '',
Reason: obj.Reason || '',
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "MaintenanceInsuranceException Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/exceptions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceInsuranceException = { ...this.objMaster };
	var obj  = this.maintenanceInsuranceException;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
DomainCode: obj.DomainCode || '',
ExceptionTypeCode: obj.ExceptionTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
SeverityCode: obj.SeverityCode || '',
Reason: obj.Reason || '',
AssignedToUserId: obj.AssignedToUserId || 0,
StatusCode: obj.StatusCode || '',
ResolvedAt:  obj.ResolvedAt || new Date(),
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
     ExceptionNo:  formValues.ExceptionNo || null,
DomainCode:  formValues.DomainCode || null,
ExceptionTypeCode:  formValues.ExceptionTypeCode || null,
ReferenceTypeCode:  formValues.ReferenceTypeCode || null,
ReferenceId:  formValues.ReferenceId || null,
SeverityCode:  formValues.SeverityCode || null,
Reason:  formValues.Reason || null,
AssignedToUserId:  formValues.AssignedToUserId || null,
StatusCode:  formValues.StatusCode || null,
ResolvedAt:  formValues.ResolvedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceInsuranceException ;
	
	this.spinner.show();  	   
    this.maintenanceInsuranceExceptionService.update(this.maintenanceInsuranceException.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceInsuranceException +  'Details Updated sucessfully.');
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
