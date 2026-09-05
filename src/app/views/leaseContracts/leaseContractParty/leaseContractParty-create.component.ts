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
import { ILeaseContractParty } from './leaseContractParty';
import { LeaseContractPartyService } from './leaseContractParty.service';

@Component({
  selector: 'app-leaseContractParty-create',
  standalone: false,
  templateUrl: './leaseContractParty-create.component.html' ,
   providers: [ MessageService]
})
export class LeaseContractPartyCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leaseContractParty: ILeaseContractParty = null;
  leasecontractidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
partyrolecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeaseContractParty = {} as ILeaseContractParty;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leaseContractPartyService: LeaseContractPartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractParty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyRoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),
LegalNameSnapshot: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
RegistrationNoSnapshot: new FormControl('', [Validators.maxLength(80), ]), 
TaxIdSnapshot: new FormControl('', [Validators.maxLength(80), ]), 
AddressSnapshotJson: new FormControl('', [Validators.maxLength(8000), ]), 
ContactSnapshotJson: new FormControl('', [Validators.maxLength(8000), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.Caption = 'Create LeaseContractParty';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties',
      options => this.partyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.partyrolecodeOptions = this.loggedInUserService.getPicklistOptions('PartyRoleCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leaseContractPartyService.getById(this.selectedId).subscribe({
      next: data => {
        this.leaseContractParty = data;
        this.objMaster = { ...this.leaseContractParty };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeaseContractParty): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
PartyId: obj.PartyId || 0,
PartyRoleCode: obj.PartyRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
LegalNameSnapshot: obj.LegalNameSnapshot || '',
RegistrationNoSnapshot: obj.RegistrationNoSnapshot || '',
TaxIdSnapshot: obj.TaxIdSnapshot || '',
AddressSnapshotJson: obj.AddressSnapshotJson || '',
ContactSnapshotJson: obj.ContactSnapshotJson || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractPartys/create']);
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
    this.leaseContractParty = { ...this.objMaster };
    var obj  = this.leaseContractParty;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
PartyId: obj.PartyId || 0,
PartyRoleCode: obj.PartyRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
LegalNameSnapshot: obj.LegalNameSnapshot || '',
RegistrationNoSnapshot: obj.RegistrationNoSnapshot || '',
TaxIdSnapshot: obj.TaxIdSnapshot || '',
AddressSnapshotJson: obj.AddressSnapshotJson || '',
ContactSnapshotJson: obj.ContactSnapshotJson || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
PartyId: formValues.PartyId || 0,
PartyRoleCode: formValues.PartyRoleCode || null,
IsPrimary: formValues.IsPrimary || false,
LegalNameSnapshot: formValues.LegalNameSnapshot || null,
RegistrationNoSnapshot: formValues.RegistrationNoSnapshot || null,
TaxIdSnapshot: formValues.TaxIdSnapshot || null,
AddressSnapshotJson: formValues.AddressSnapshotJson || null,
ContactSnapshotJson: formValues.ContactSnapshotJson || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as ILeaseContractParty ; 
	
	  this.spinner.show(); 
    this.leaseContractPartyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeaseContractParty +  'Details Updated sucessfully.');
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



