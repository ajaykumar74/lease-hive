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
import { IReceiptStatus } from './receiptStatus';
import { ReceiptStatusService } from './receiptStatus.service';

@Component({
  selector: 'app-receiptStatus-create',
  standalone: false,
  templateUrl: './receiptStatus-create.component.html' ,
   providers: [ MessageService]
})
export class ReceiptStatusCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  receiptStatus: IReceiptStatus = null;
  statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IReceiptStatus = {} as IReceiptStatus;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private receiptStatusService: ReceiptStatusService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.receiptStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),

    });
    this.Caption = 'Create ReceiptStatus';
    this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ReceiptStatusStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.receiptStatusService.getById(this.selectedId).subscribe({
      next: data => {
        this.receiptStatus = data;
        this.objMaster = { ...this.receiptStatus };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IReceiptStatus): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/receiptStatuss/create']);
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
    this.receiptStatus = { ...this.objMaster };
    var obj  = this.receiptStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
 
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
     StatusCode: formValues.StatusCode || null,
StatusName: formValues.StatusName || null,
RecordStatus: 'Active',

    } as IReceiptStatus ; 
	
	  this.spinner.show(); 
    this.receiptStatusService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ReceiptStatus +  'Details Updated sucessfully.');
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



