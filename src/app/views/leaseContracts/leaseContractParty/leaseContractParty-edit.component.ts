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
import { ILeaseContractParty } from './leaseContractParty';
import { LeaseContractPartyService } from './leaseContractParty.service';


@Component({
  selector: 'app-leaseContractParty-edit',
  standalone: false,
  templateUrl: './leaseContractParty-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractPartyEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseContractParty: ILeaseContractParty = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
partyrolecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractParty = {} as ILeaseContractParty;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractPartyService: LeaseContractPartyService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractParty };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.partyidOptions.push({Text: 'PartyId1', Value: 'PartyId1' });
this.partyidOptions.push({Text: 'PartyId2', Value: 'PartyId2' });
this.partyrolecodeOptions = this.loggedInUserService.getPicklistOptions('PartyRoleCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractPartyService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractParty = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractParty };
        this.populateUI(this.leaseContractParty);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "LeaseContractParty Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/dashboard/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractId:  formValues.LeaseContractId || null,
PartyId:  formValues.PartyId || null,
PartyRoleCode:  formValues.PartyRoleCode || null,
IsPrimary:  formValues.IsPrimary || null,
LegalNameSnapshot:  formValues.LegalNameSnapshot || null,
RegistrationNoSnapshot:  formValues.RegistrationNoSnapshot || null,
TaxIdSnapshot:  formValues.TaxIdSnapshot || null,
AddressSnapshotJson:  formValues.AddressSnapshotJson || null,
ContactSnapshotJson:  formValues.ContactSnapshotJson || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as ILeaseContractParty ;
	
	this.spinner.show();  	   
    this.leaseContractPartyService.update(this.leaseContractParty.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractParty +  'Details Updated sucessfully.');
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
