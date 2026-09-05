import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPartyGSTRegistration } from './partyGSTRegistration';
import { PartyGSTRegistrationService } from './partyGSTRegistration.service';
import { PartyService } from '@/views/parties/party/party.service';
import { IParty } from '@/views/parties/party/party';

@Component({
  selector: 'app-partyGSTRegistration-create',
  standalone: false,
  templateUrl: './partyGSTRegistration-create.component.html' ,
   providers: [ MessageService]
})
export class PartyGSTRegistrationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Party GST Registration';
  partyGSTRegistration: IPartyGSTRegistration = null;
  partyId: number | null = null;
  party: IParty | null = null;
  partyidOptions: ISelectItem[] = [];
statecodeOptions: ISelectItem[] = [];
registrationtypeOptions: ISelectItem[] = [];
principallocationidOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyGSTRegistration = {} as IPartyGSTRegistration;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private partyGSTRegistrationService: PartyGSTRegistrationService,
	private partyService: PartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyGSTRegistration };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
GSTIN: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LegalNameAsPerGST: new FormControl('', [Validators.required, Validators.maxLength(150), ]),
TradeNameAsPerGST: new FormControl('', [Validators.required, Validators.maxLength(150), ]),
StateCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RegistrationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RegistrationDate: new FormControl(new Date(), [Validators.required]),
PrincipalLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
VerificationStatus: new FormControl('', [Validators.maxLength(20), ]), 
VerifiedAt: new FormControl(new Date(), []),
CancellationDate: new FormControl(new Date(), []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
IsDefault: new FormControl(false, []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    const routePartyId = Number(this.activatedRoute.snapshot.paramMap.get('partyId'));
    this.partyId = routePartyId > 0 ? routePartyId : null;
    if (this.partyId) {
      this.editForm.patchValue({ PartyId: this.partyId });
      this.editForm.controls.PartyId.disable();
      this.loadParty(this.partyId);
    }
this.statecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.registrationtypeOptions = this.loggedInUserService.getPicklistOptions('RegistrationType');
this.verificationstatusOptions = this.loggedInUserService.getPicklistOptions('VerificationStatus');
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.principallocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  private loadParty(partyId: number): void {
    this.partyService.getById(partyId).subscribe({
      next: response => {
        this.party = response.data;
        this.Caption = `Create GST Registration - ${this.party.PartyCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

 loadUI(): void {
    this.isLoading = true;    
    this.partyGSTRegistrationService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyGSTRegistration = data;
        this.objMaster = { ...this.partyGSTRegistration };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyGSTRegistration): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
GSTIN: obj.GSTIN || '',
LegalNameAsPerGST: obj.LegalNameAsPerGST || '',
TradeNameAsPerGST: obj.TradeNameAsPerGST || '',
StateCode: obj.StateCode || '',
RegistrationType: obj.RegistrationType || '',
RegistrationDate:  obj.RegistrationDate || new Date(),
PrincipalLocationId: obj.PrincipalLocationId || 0,
VerificationStatus: obj.VerificationStatus || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
CancellationDate:  obj.CancellationDate || new Date(),
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsDefault:  obj.IsDefault || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/gst-registrations/create']);
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
    if (this.partyId) {
      this.router.navigate(['/business/parties/gst-registrations/party', this.partyId]);
      return;
    }
    this.partyGSTRegistration = { ...this.objMaster };
    var obj  = this.partyGSTRegistration;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
GSTIN: obj.GSTIN || '',
LegalNameAsPerGST: obj.LegalNameAsPerGST || '',
TradeNameAsPerGST: obj.TradeNameAsPerGST || '',
StateCode: obj.StateCode || '',
RegistrationType: obj.RegistrationType || '',
RegistrationDate:  obj.RegistrationDate || new Date(),
PrincipalLocationId: obj.PrincipalLocationId || 0,
VerificationStatus: obj.VerificationStatus || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
CancellationDate:  obj.CancellationDate || new Date(),
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsDefault:  obj.IsDefault || false,
 
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
	const selectedPartyId = this.partyId ?? Number(formValues.PartyId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId: selectedPartyId || null,
GSTIN: formValues.GSTIN || null,
LegalNameAsPerGST: formValues.LegalNameAsPerGST || null,
TradeNameAsPerGST: formValues.TradeNameAsPerGST || null,
StateCode: formValues.StateCode || null,
RegistrationType: formValues.RegistrationType || null,
RegistrationDate: formValues.RegistrationDate || null,
PrincipalLocationId: formValues.PrincipalLocationId || null,
VerificationStatus: formValues.VerificationStatus || null,
VerifiedAt: formValues.VerifiedAt || null,
CancellationDate: formValues.CancellationDate || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
IsDefault: formValues.IsDefault || null,

    } as IPartyGSTRegistration ; 
	
	  this.spinner.show(); 
    this.partyGSTRegistrationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyGSTRegistration +  'Details Updated sucessfully.');
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



