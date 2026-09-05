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
import { IContractSuspension } from './contractSuspension';
import { ContractSuspensionService } from './contractSuspension.service';

@Component({
  selector: 'app-contractSuspension-create',
  standalone: false,
  templateUrl: './contractSuspension-create.component.html' ,
   providers: [ MessageService]
})
export class ContractSuspensionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractSuspension: IContractSuspension = null;
  leasecontractidOptions: ISelectItem[] = [];
suspensionreasoncodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractSuspension = {} as IContractSuspension;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractSuspensionService: ContractSuspensionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractSuspension };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SuspensionReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SuspendedFrom: new FormControl(new Date(), [Validators.required]),
SuspendedTo: new FormControl(new Date(), []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Notes: new FormControl('', [Validators.maxLength(1000), ]), 

    });
    this.Caption = 'Create ContractSuspension';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.suspensionreasoncodeOptions = this.loggedInUserService.getPicklistOptions('SuspensionReasonCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ContractSuspensionStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractSuspensionService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractSuspension = data;
        this.objMaster = { ...this.contractSuspension };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractSuspension): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
SuspensionReasonCode: obj.SuspensionReasonCode || '',
SuspendedFrom:  obj.SuspendedFrom || new Date(),
SuspendedTo:  obj.SuspendedTo || new Date(),
StatusCode: obj.StatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
Notes: obj.Notes || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractSuspensions/create']);
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
    this.contractSuspension = { ...this.objMaster };
    var obj  = this.contractSuspension;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
SuspensionReasonCode: obj.SuspensionReasonCode || '',
SuspendedFrom:  obj.SuspendedFrom || new Date(),
SuspendedTo:  obj.SuspendedTo || new Date(),
StatusCode: obj.StatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
Notes: obj.Notes || '',
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
SuspensionReasonCode: formValues.SuspensionReasonCode || null,
SuspendedFrom: formValues.SuspendedFrom || null,
SuspendedTo: formValues.SuspendedTo || null,
StatusCode: formValues.StatusCode || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
Notes: formValues.Notes || null,

    } as IContractSuspension ; 
	
	  this.spinner.show(); 
    this.contractSuspensionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractSuspension +  'Details Updated sucessfully.');
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



