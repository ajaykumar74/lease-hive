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
import { IPartyGSTRegistration } from './partyGSTRegistration';
import { PartyGSTRegistrationService } from './partyGSTRegistration.service';


@Component({
  selector: 'app-partyGSTRegistration-edit',
  standalone: false,
  templateUrl: './partyGSTRegistration-edit.component.html',
  providers: [ MessageService]
})
export class PartyGSTRegistrationEditComponent implements OnInit {

  selectedId: number;
  partyId: number | null = null;
  isLoading: boolean = false;
  partyGSTRegistration: IPartyGSTRegistration = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
statecodeOptions: ISelectItem[] = [];
registrationtypeOptions: ISelectItem[] = [];
principallocationidOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyGSTRegistration = {} as IPartyGSTRegistration;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyGSTRegistrationService: PartyGSTRegistrationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyGSTRegistration };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
IsDefault: new FormControl(false), 

    });
this.statecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.registrationtypeOptions = this.loggedInUserService.getPicklistOptions('RegistrationType');
this.verificationstatusOptions = this.loggedInUserService.getPicklistOptions('VerificationStatus');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routePartyId = Number(this.activatedRouter.snapshot.paramMap.get('partyId'));
     this.partyId = routePartyId > 0 ? routePartyId : null;
     if (this.partyId) this.editForm.controls.PartyId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyGSTRegistrationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyGSTRegistration = data.data;
		if (this.partyId && this.partyGSTRegistration.PartyId !== this.partyId) {
		  this.messageService.showError('This record does not belong to the selected party.');
		  this.router.navigate(['/dashboard/partyGSTRegistrations/party', this.partyId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.partyGSTRegistration };
        this.populateUI(this.partyGSTRegistration);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPartyGSTRegistration): void {
    this.loggedInUserService.getLookupOptions('party-locations', obj.PrincipalLocationId).subscribe({
      next: options => this.principallocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsDefault:  obj.IsDefault || false,
 
      }
    );
   
	 this.Caption = "PartyGSTRegistration Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyGSTRegistration/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
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
RecordStatus: obj.RecordStatus || '',
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId:  this.partyId ?? formValues.PartyId ?? this.objMaster.PartyId,
GSTIN:  formValues.GSTIN || null,
LegalNameAsPerGST:  formValues.LegalNameAsPerGST || null,
TradeNameAsPerGST:  formValues.TradeNameAsPerGST || null,
StateCode:  formValues.StateCode || null,
RegistrationType:  formValues.RegistrationType || null,
RegistrationDate:  formValues.RegistrationDate || null,
PrincipalLocationId:  formValues.PrincipalLocationId || null,
VerificationStatus:  formValues.VerificationStatus || null,
VerifiedAt:  formValues.VerifiedAt || null,
CancellationDate:  formValues.CancellationDate || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
IsDefault:  formValues.IsDefault || null,

    } as IPartyGSTRegistration ;
	
	this.spinner.show();  	   
    this.partyGSTRegistrationService.update(this.partyGSTRegistration.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyGSTRegistration +  'Details Updated sucessfully.');
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
