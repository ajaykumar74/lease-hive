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
import { IContractAmendment } from './contractAmendment';
import { ContractAmendmentService } from './contractAmendment.service';

@Component({
  selector: 'app-contractAmendment-create',
  standalone: false,
  templateUrl: './contractAmendment-create.component.html' ,
   providers: [ MessageService]
})
export class ContractAmendmentCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractAmendment: IContractAmendment = null;
  leasecontractidOptions: ISelectItem[] = [];
amendmenttypecodeOptions: ISelectItem[] = [];
amendmentstatuscodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractAmendment = {} as IContractAmendment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractAmendmentService: ContractAmendmentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractAmendment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AmendmentNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
FromVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ToVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
AmendmentTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedDate: new FormControl(new Date(), [Validators.required]),
EffectiveDate: new FormControl(new Date(), []),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AmendmentStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExecutedOn: new FormControl(new Date(), []),

    });
    this.Caption = 'Create ContractAmendment';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.amendmenttypecodeOptions = this.loggedInUserService.getPicklistOptions('AmendmentTypeCode');
this.amendmentstatuscodeOptions = this.loggedInUserService.getPicklistOptions('AmendmentStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractAmendmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractAmendment = data;
        this.objMaster = { ...this.contractAmendment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractAmendment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AmendmentNo: obj.AmendmentNo || '',
FromVersionNo: obj.FromVersionNo || 0,
ToVersionNo: obj.ToVersionNo || 0,
AmendmentTypeCode: obj.AmendmentTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
Reason: obj.Reason || '',
AmendmentStatusCode: obj.AmendmentStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
ExecutedOn:  obj.ExecutedOn || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractAmendments/create']);
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
    this.contractAmendment = { ...this.objMaster };
    var obj  = this.contractAmendment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AmendmentNo: obj.AmendmentNo || '',
FromVersionNo: obj.FromVersionNo || 0,
ToVersionNo: obj.ToVersionNo || 0,
AmendmentTypeCode: obj.AmendmentTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
Reason: obj.Reason || '',
AmendmentStatusCode: obj.AmendmentStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
ExecutedOn:  obj.ExecutedOn || new Date(),
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
AmendmentNo: formValues.AmendmentNo || null,
FromVersionNo: formValues.FromVersionNo || null,
ToVersionNo: formValues.ToVersionNo || null,
AmendmentTypeCode: formValues.AmendmentTypeCode || null,
RequestedDate: formValues.RequestedDate || null,
EffectiveDate: formValues.EffectiveDate || null,
Reason: formValues.Reason || null,
AmendmentStatusCode: formValues.AmendmentStatusCode || null,
ApprovalRequestId: formValues.ApprovalRequestId || 0,
ExecutedOn: formValues.ExecutedOn || null,

    } as IContractAmendment ; 
	
	  this.spinner.show(); 
    this.contractAmendmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractAmendment +  'Details Updated sucessfully.');
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



