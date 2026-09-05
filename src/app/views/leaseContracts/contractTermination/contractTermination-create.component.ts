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
import { IContractTermination } from './contractTermination';
import { ContractTerminationService } from './contractTermination.service';

@Component({
  selector: 'app-contractTermination-create',
  standalone: false,
  templateUrl: './contractTermination-create.component.html' ,
   providers: [ MessageService]
})
export class ContractTerminationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractTermination: IContractTermination = null;
  leasecontractidOptions: ISelectItem[] = [];
terminationtypecodeOptions: ISelectItem[] = [];
terminationstatuscodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractTermination = {} as IContractTermination;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractTerminationService: ContractTerminationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractTermination };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TerminationNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
TerminationTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedDate: new FormControl(new Date(), [Validators.required]),
ProposedTerminationDate: new FormControl(new Date(), [Validators.required]),
ActualTerminationDate: new FormControl(new Date(), []),
ReasonCode: new FormControl('', [Validators.maxLength(20), ]), 
Reason: new FormControl('', [Validators.maxLength(100), ]), 
TerminationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractTermination';
    this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.terminationtypecodeOptions = this.loggedInUserService.getPicklistOptions('TerminationTypeCode');
this.terminationstatuscodeOptions = this.loggedInUserService.getPicklistOptions('TerminationStatusCode');
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId1', Value: 'ApprovalRequestId1' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId2', Value: 'ApprovalRequestId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractTerminationService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractTermination = data;
        this.objMaster = { ...this.contractTermination };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractTermination): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
TerminationNo: obj.TerminationNo || '',
TerminationTypeCode: obj.TerminationTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
ProposedTerminationDate:  obj.ProposedTerminationDate || new Date(),
ActualTerminationDate:  obj.ActualTerminationDate || new Date(),
ReasonCode: obj.ReasonCode || '',
Reason: obj.Reason || '',
TerminationStatusCode: obj.TerminationStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractTerminations/create']);
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
    this.contractTermination = { ...this.objMaster };
    var obj  = this.contractTermination;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
TerminationNo: obj.TerminationNo || '',
TerminationTypeCode: obj.TerminationTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
ProposedTerminationDate:  obj.ProposedTerminationDate || new Date(),
ActualTerminationDate:  obj.ActualTerminationDate || new Date(),
ReasonCode: obj.ReasonCode || '',
Reason: obj.Reason || '',
TerminationStatusCode: obj.TerminationStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
 
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
TerminationNo: formValues.TerminationNo || null,
TerminationTypeCode: formValues.TerminationTypeCode || null,
RequestedDate: formValues.RequestedDate || null,
ProposedTerminationDate: formValues.ProposedTerminationDate || null,
ActualTerminationDate: formValues.ActualTerminationDate || null,
ReasonCode: formValues.ReasonCode || null,
Reason: formValues.Reason || null,
TerminationStatusCode: formValues.TerminationStatusCode || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,

    } as IContractTermination ; 
	
	  this.spinner.show(); 
    this.contractTerminationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractTermination +  'Details Updated sucessfully.');
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



