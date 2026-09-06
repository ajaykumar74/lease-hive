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
import { IProcurementException } from './procurementException';
import { ProcurementExceptionService } from './procurementException.service';

@Component({
  selector: 'app-procurementException-create',
  standalone: false,
  templateUrl: './procurementException-create.component.html' ,
   providers: [ MessageService]
})
export class ProcurementExceptionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  procurementException: IProcurementException = null;
  referencetypeOptions: ISelectItem[] = [];
exceptiontypecodeOptions: ISelectItem[] = [];
severitycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IProcurementException = {} as IProcurementException;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private procurementExceptionService: ProcurementExceptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.procurementException };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ExceptionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SeverityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Resolution: new FormControl('', [Validators.maxLength(1000), ]), 
ResolvedOn: new FormControl(new Date(), []),

    });
    this.Caption = 'Create ProcurementException';
    this.referencetypeOptions.push({Text: 'RFQ', Value: 'RFQ' });
this.referencetypeOptions.push({Text: 'PO', Value: 'PO' });
this.referencetypeOptions.push({Text: 'GRN', Value: 'GRN' });
this.referencetypeOptions.push({Text: 'INVOICE', Value: 'INVOICE' });
this.referencetypeOptions.push({Text: 'MATCH', Value: 'MATCH' });
this.exceptiontypecodeOptions.push({Text: 'PRICE', Value: 'PRICE' });
this.exceptiontypecodeOptions.push({Text: 'QTY', Value: 'QTY' });
this.exceptiontypecodeOptions.push({Text: 'QUALITY', Value: 'QUALITY' });
this.exceptiontypecodeOptions.push({Text: 'TAX', Value: 'TAX' });
this.exceptiontypecodeOptions.push({Text: 'DELIVERY', Value: 'DELIVERY' });
this.exceptiontypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.severitycodeOptions.push({Text: 'INFO', Value: 'INFO' });
this.severitycodeOptions.push({Text: 'WARNING', Value: 'WARNING' });
this.severitycodeOptions.push({Text: 'BLOCKING', Value: 'BLOCKING' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'RESOLVED', Value: 'RESOLVED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.procurementExceptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.procurementException = data;
        this.objMaster = { ...this.procurementException };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IProcurementException): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExceptionTypeCode: obj.ExceptionTypeCode || '',
SeverityCode: obj.SeverityCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
Resolution: obj.Resolution || '',
ResolvedOn:  obj.ResolvedOn || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/procurementExceptions/create']);
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
    this.procurementException = { ...this.objMaster };
    var obj  = this.procurementException;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExceptionTypeCode: obj.ExceptionTypeCode || '',
SeverityCode: obj.SeverityCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
Resolution: obj.Resolution || '',
ResolvedOn:  obj.ResolvedOn || new Date(),
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
ExceptionTypeCode: formValues.ExceptionTypeCode || null,
SeverityCode: formValues.SeverityCode || null,
Description: formValues.Description || null,
StatusCode: formValues.StatusCode || null,
AssignedToUserId: formValues.AssignedToUserId || 0,
Resolution: formValues.Resolution || null,
ResolvedOn: formValues.ResolvedOn || null,

    } as IProcurementException ; 
	
	  this.spinner.show(); 
    this.procurementExceptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ProcurementException +  'Details Updated sucessfully.');
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



