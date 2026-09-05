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
import { IContractExternalReference } from './contractExternalReference';
import { ContractExternalReferenceService } from './contractExternalReference.service';

@Component({
  selector: 'app-contractExternalReference-create',
  standalone: false,
  templateUrl: './contractExternalReference-create.component.html' ,
   providers: [ MessageService]
})
export class ContractExternalReferenceCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractExternalReference: IContractExternalReference = null;
  leasecontractidOptions: ISelectItem[] = [];
referencetypecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractExternalReference = {} as IContractExternalReference;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractExternalReferenceService: ContractExternalReferenceService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractExternalReference };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceValue: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
ProviderCode: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), []),
EffectiveTo: new FormControl(new Date(), []),
IsPrimary: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create ContractExternalReference';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.referencetypecodeOptions = this.loggedInUserService.getPicklistOptions('ContractExternalReferenceReferenceTypeCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractExternalReferenceService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractExternalReference = data;
        this.objMaster = { ...this.contractExternalReference };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractExternalReference): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceValue: obj.ReferenceValue || '',
ProviderCode: obj.ProviderCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractExternalReferences/create']);
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
    this.contractExternalReference = { ...this.objMaster };
    var obj  = this.contractExternalReference;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceValue: obj.ReferenceValue || '',
ProviderCode: obj.ProviderCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsPrimary:  obj.IsPrimary || false,
 
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
ReferenceTypeCode: formValues.ReferenceTypeCode || null,
ReferenceValue: formValues.ReferenceValue || null,
ProviderCode: formValues.ProviderCode || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
IsPrimary: formValues.IsPrimary || false,

    } as IContractExternalReference ; 
	
	  this.spinner.show(); 
    this.contractExternalReferenceService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractExternalReference +  'Details Updated sucessfully.');
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



