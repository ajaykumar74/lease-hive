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
import { IPartyCreditProfile } from './partyCreditProfile';
import { PartyCreditProfileService } from './partyCreditProfile.service';
import { PartyService } from '@/views/parties/party/party.service';
import { IParty } from '@/views/parties/party/party';

@Component({
  selector: 'app-partyCreditProfile-create',
  standalone: false,
  templateUrl: './partyCreditProfile-create.component.html' ,
   providers: [ MessageService]
})
export class PartyCreditProfileCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Party Credit Profile';
  partyCreditProfile: IPartyCreditProfile = null;
  partyId: number | null = null;
  party: IParty | null = null;
  partyidOptions: ISelectItem[] = [];
creditpolicycodeOptions: ISelectItem[] = [];
riskgradeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
reviewfrequencymonthsOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyCreditProfile = {} as IPartyCreditProfile;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private partyCreditProfileService: PartyCreditProfileService,
	private partyService: PartyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyCreditProfile };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CreditPolicyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RiskGrade: new FormControl('', [Validators.required, Validators.maxLength(5), ]),
ExternalCreditScore: new FormControl(0, []),
ApprovedExposureLimit: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(0), ]),
CurrentExposure: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AvailableExposure: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PaymentTermsDays: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
ReviewFrequencyMonths: new FormControl(0, []),
NextReviewDate: new FormControl(new Date(), []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

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
this.creditpolicycodeOptions.push({Text: 'PAN', Value: 'PAN' });
this.creditpolicycodeOptions.push({Text: 'GSTCertificate', Value: 'GSTCertificate' });
this.creditpolicycodeOptions.push({Text: 'CINCertificate', Value: 'CINCertificate' });
this.creditpolicycodeOptions.push({Text: 'BankProof', Value: 'BankProof' });
this.creditpolicycodeOptions.push({Text: 'AddressProof', Value: 'AddressProof' });
this.riskgradeOptions = this.loggedInUserService.getPicklistOptions('RiskGrade');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.reviewfrequencymonthsOptions.push({Text: '1', Value: '1' });
this.reviewfrequencymonthsOptions.push({Text: '2', Value: '2' });
this.reviewfrequencymonthsOptions.push({Text: '3', Value: '3' });
this.reviewfrequencymonthsOptions.push({Text: '4', Value: '4' });
this.reviewfrequencymonthsOptions.push({Text: '5', Value: '5' });
this.reviewfrequencymonthsOptions.push({Text: '6', Value: '6' });
this.reviewfrequencymonthsOptions.push({Text: '7', Value: '7' });
this.reviewfrequencymonthsOptions.push({Text: '8', Value: '8' });
this.reviewfrequencymonthsOptions.push({Text: '9', Value: '9' });
this.reviewfrequencymonthsOptions.push({Text: '10', Value: '10' });
this.reviewfrequencymonthsOptions.push({Text: '11', Value: '11' });
this.reviewfrequencymonthsOptions.push({Text: '12', Value: '12' });

  }

  private loadParty(partyId: number): void {
    this.partyService.getById(partyId).subscribe({
      next: response => {
        this.party = response.data;
        this.Caption = `Create Credit Profile - ${this.party.PartyCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

 loadUI(): void {
    this.isLoading = true;    
    this.partyCreditProfileService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyCreditProfile = data;
        this.objMaster = { ...this.partyCreditProfile };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyCreditProfile): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CreditPolicyCode: obj.CreditPolicyCode || '',
RiskGrade: obj.RiskGrade || '',
ExternalCreditScore: obj.ExternalCreditScore || 0,
ApprovedExposureLimit: obj.ApprovedExposureLimit || 0,
CurrencyCode: obj.CurrencyCode || '',
CurrentExposure: obj.CurrentExposure || 0,
AvailableExposure: obj.AvailableExposure || 0,
PaymentTermsDays: obj.PaymentTermsDays || 0,
ReviewFrequencyMonths: obj.ReviewFrequencyMonths || 0,
NextReviewDate:  obj.NextReviewDate || new Date(),
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/credit-profiles/create']);
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
      this.router.navigate(['/business/parties/credit-profiles/party', this.partyId]);
      return;
    }
    this.partyCreditProfile = { ...this.objMaster };
    var obj  = this.partyCreditProfile;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
CreditPolicyCode: obj.CreditPolicyCode || '',
RiskGrade: obj.RiskGrade || '',
ExternalCreditScore: obj.ExternalCreditScore || 0,
ApprovedExposureLimit: obj.ApprovedExposureLimit || 0,
CurrencyCode: obj.CurrencyCode || '',
CurrentExposure: obj.CurrentExposure || 0,
AvailableExposure: obj.AvailableExposure || 0,
PaymentTermsDays: obj.PaymentTermsDays || 0,
ReviewFrequencyMonths: obj.ReviewFrequencyMonths || 0,
NextReviewDate:  obj.NextReviewDate || new Date(),
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
	const selectedPartyId = this.partyId ?? Number(formValues.PartyId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId: selectedPartyId || 0,
CreditPolicyCode: formValues.CreditPolicyCode || null,
RiskGrade: formValues.RiskGrade || null,
ExternalCreditScore: formValues.ExternalCreditScore || 0,
ApprovedExposureLimit: formValues.ApprovedExposureLimit || 0,
CurrencyCode: formValues.CurrencyCode || null,
CurrentExposure: formValues.CurrentExposure || 0,
AvailableExposure: formValues.AvailableExposure || 0,
PaymentTermsDays: formValues.PaymentTermsDays || null,
ReviewFrequencyMonths: formValues.ReviewFrequencyMonths || null,
NextReviewDate: formValues.NextReviewDate || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyCreditProfile ; 
	
	  this.spinner.show(); 
    this.partyCreditProfileService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyCreditProfile +  'Details Updated sucessfully.');
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



