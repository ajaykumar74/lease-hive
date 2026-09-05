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
import { IParty } from './party';
import { PartyService } from './party.service';

@Component({
  selector: 'app-party-create',
  standalone: false,
  templateUrl: './party-create.component.html' ,
   providers: [ MessageService]
})
export class PartyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Party';
  party: IParty = null;
  partykindOptions: ISelectItem[] = [];
countryofregistrationOptions: ISelectItem[] = [];
industrycodeOptions: ISelectItem[] = [];
preferredcurrencycodeOptions: ISelectItem[] = [];
taxresidencycountrycodeOptions: ISelectItem[] = [];
riskclassificationOptions: ISelectItem[] = [];
onboardingstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IParty = {} as IParty;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyService: PartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.party };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PartyKind: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LegalName: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
TradeName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
PAN: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
RegistrationNumber: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IncorporationDate: new FormControl(new Date(), [Validators.required]),
CountryOfRegistration: new FormControl('', [Validators.required, Validators.maxLength(2), ]),
IndustryCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
WebsiteUrl: new FormControl('', [Validators.maxLength(100), ]), 
PreferredCurrencyCode: new FormControl('', [Validators.maxLength(3), ]), 
TaxResidencyCountryCode: new FormControl('', [Validators.maxLength(2), ]), 
IsRelatedParty: new FormControl(false, []),
RiskClassification: new FormControl('', [Validators.maxLength(20), ]), 
OnboardingStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
this.partykindOptions = this.loggedInUserService.getPicklistOptions('PartyKind');
this.countryofregistrationOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.industrycodeOptions = this.loggedInUserService.getPicklistOptions('IndustryCode');
this.preferredcurrencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.taxresidencycountrycodeOptions = this.loggedInUserService.getPicklistOptions('TaxResidencyCountryCode');
this.riskclassificationOptions = this.loggedInUserService.getPicklistOptions('RiskClassification');
this.onboardingstatusOptions = this.loggedInUserService.getPicklistOptions('OnboardingStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyService.getById(this.selectedId).subscribe({
      next: data => {
        this.party = data;
        this.objMaster = { ...this.party };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IParty): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyCode: obj.PartyCode || '',
PartyKind: obj.PartyKind || '',
LegalName: obj.LegalName || '',
TradeName: obj.TradeName || '',
PAN: obj.PAN || '',
RegistrationNumber: obj.RegistrationNumber || '',
IncorporationDate:  obj.IncorporationDate || new Date(),
CountryOfRegistration: obj.CountryOfRegistration || '',
IndustryCode: obj.IndustryCode || '',
WebsiteUrl: obj.WebsiteUrl || '',
PreferredCurrencyCode: obj.PreferredCurrencyCode || '',
TaxResidencyCountryCode: obj.TaxResidencyCountryCode || '',
IsRelatedParty:  obj.IsRelatedParty || false,
RiskClassification: obj.RiskClassification || '',
OnboardingStatus: obj.OnboardingStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partys/create']);
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
    this.party = { ...this.objMaster };
    var obj  = this.party;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyCode: obj.PartyCode || '',
PartyKind: obj.PartyKind || '',
LegalName: obj.LegalName || '',
TradeName: obj.TradeName || '',
PAN: obj.PAN || '',
RegistrationNumber: obj.RegistrationNumber || '',
IncorporationDate:  obj.IncorporationDate || new Date(),
CountryOfRegistration: obj.CountryOfRegistration || '',
IndustryCode: obj.IndustryCode || '',
WebsiteUrl: obj.WebsiteUrl || '',
PreferredCurrencyCode: obj.PreferredCurrencyCode || '',
TaxResidencyCountryCode: obj.TaxResidencyCountryCode || '',
IsRelatedParty:  obj.IsRelatedParty || false,
RiskClassification: obj.RiskClassification || '',
OnboardingStatus: obj.OnboardingStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
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
     PartyCode: formValues.PartyCode || null,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
PartyKind: formValues.PartyKind || null,
LegalName: formValues.LegalName || null,
TradeName: formValues.TradeName || null,
PAN: formValues.PAN || null,
RegistrationNumber: formValues.RegistrationNumber || null,
IncorporationDate: formValues.IncorporationDate || null,
CountryOfRegistration: formValues.CountryOfRegistration || null,
IndustryCode: formValues.IndustryCode || null,
WebsiteUrl: formValues.WebsiteUrl || null,
PreferredCurrencyCode: formValues.PreferredCurrencyCode || null,
TaxResidencyCountryCode: formValues.TaxResidencyCountryCode || null,
IsRelatedParty: formValues.IsRelatedParty || null,
RiskClassification: formValues.RiskClassification || null,
OnboardingStatus: formValues.OnboardingStatus || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Description: formValues.Description || null,

    } as IParty ; 
	
	  this.spinner.show(); 
    this.partyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Party +  'Details Updated sucessfully.');
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



