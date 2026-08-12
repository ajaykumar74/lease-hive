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
import { IParty } from './party';
import { PartyService } from './party.service';


@Component({
  selector: 'app-party-edit',
  standalone: false,
  templateUrl: './party-edit.component.html',
  providers: [ MessageService]
})
export class PartyEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  party: IParty = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partykindOptions: ISelectItem[] = [];
countryofregistrationOptions: ISelectItem[] = [];
industrycodeOptions: ISelectItem[] = [];
preferredcurrencycodeOptions: ISelectItem[] = [];
taxresidencycountrycodeOptions: ISelectItem[] = [];
riskclassificationOptions: ISelectItem[] = [];
onboardingstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IParty = {} as IParty;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyService: PartyService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.party };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
IsRelatedParty: new FormControl(false), 
RiskClassification: new FormControl('', [Validators.maxLength(20), ]), 
OnboardingStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.partykindOptions.push({Text: 'Organisation', Value: 'Organisation' });
this.partykindOptions.push({Text: 'Individual', Value: 'Individual' });
this.countryofregistrationOptions.push({Text: 'IN', Value: 'IN' });
this.countryofregistrationOptions.push({Text: 'USA', Value: 'USA' });
this.countryofregistrationOptions.push({Text: 'UK', Value: 'UK' });
this.industrycodeOptions.push({Text: 'LOGISTICS', Value: 'LOGISTICS' });
this.industrycodeOptions.push({Text: 'FMS', Value: 'FMS' });
this.industrycodeOptions.push({Text: 'IT', Value: 'IT' });
this.preferredcurrencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.preferredcurrencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.preferredcurrencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.taxresidencycountrycodeOptions.push({Text: 'IN', Value: 'IN' });
this.taxresidencycountrycodeOptions.push({Text: 'USA', Value: 'USA' });
this.taxresidencycountrycodeOptions.push({Text: 'UK', Value: 'UK' });
this.riskclassificationOptions.push({Text: 'Low', Value: 'Low' });
this.riskclassificationOptions.push({Text: 'Medium', Value: 'Medium' });
this.riskclassificationOptions.push({Text: 'High', Value: 'High' });
this.onboardingstatusOptions.push({Text: 'Pending', Value: 'Pending' });
this.onboardingstatusOptions.push({Text: 'InProgress', Value: 'InProgress' });
this.onboardingstatusOptions.push({Text: 'Approved', Value: 'Approved' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.party = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.party };
        this.populateUI(this.party);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "Party Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/party/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
RecordStatus: obj.RecordStatus || '',
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyCode:  formValues.PartyCode || null,
PartyKind:  formValues.PartyKind || null,
LegalName:  formValues.LegalName || null,
TradeName:  formValues.TradeName || null,
PAN:  formValues.PAN || null,
RegistrationNumber:  formValues.RegistrationNumber || null,
IncorporationDate:  formValues.IncorporationDate || null,
CountryOfRegistration:  formValues.CountryOfRegistration || null,
IndustryCode:  formValues.IndustryCode || null,
WebsiteUrl:  formValues.WebsiteUrl || null,
PreferredCurrencyCode:  formValues.PreferredCurrencyCode || null,
TaxResidencyCountryCode:  formValues.TaxResidencyCountryCode || null,
IsRelatedParty:  formValues.IsRelatedParty || null,
RiskClassification:  formValues.RiskClassification || null,
OnboardingStatus:  formValues.OnboardingStatus || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Description:  formValues.Description || null,

    } as IParty ;
	
	this.spinner.show();  	   
    this.partyService.update(this.party.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Party +  'Details Updated sucessfully.');
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
