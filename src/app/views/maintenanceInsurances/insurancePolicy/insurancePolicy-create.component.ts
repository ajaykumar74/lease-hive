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
import { IInsurancePolicy } from './insurancePolicy';
import { InsurancePolicyService } from './insurancePolicy.service';

@Component({
  selector: 'app-insurancePolicy-create',
  standalone: false,
  templateUrl: './insurancePolicy-create.component.html' ,
   providers: [ MessageService]
})
export class InsurancePolicyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insurancePolicy: IInsurancePolicy = null;
  organisationidOptions: ISelectItem[] = [];
insurerpartyidOptions: ISelectItem[] = [];
brokerpartyidOptions: ISelectItem[] = [];
insurancepolicystatusidOptions: ISelectItem[] = [];
policytypecodeOptions: ISelectItem[] = [];
coveragetypeidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
paymentreferenceidOptions: ISelectItem[] = [];
previouspolicyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsurancePolicy = {} as IInsurancePolicy;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insurancePolicyService: InsurancePolicyService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicy };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PolicyNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BrokerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InsurancePolicyStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PolicyTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CoverageTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PolicyStartDate: new FormControl(new Date(), [Validators.required]),
PolicyEndDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TotalInsuredValue: new FormControl(0, []),
PremiumAmount: new FormControl(0, []),
TaxAmount: new FormControl(0, []),
PaymentReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PreviousPolicyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IssuedDate: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsurancePolicy';
    this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.insurerpartyidOptions.push({Text: 'InsurerPartyId1', Value: 'InsurerPartyId1' });
this.insurerpartyidOptions.push({Text: 'InsurerPartyId2', Value: 'InsurerPartyId2' });
this.brokerpartyidOptions.push({Text: 'BrokerPartyId1', Value: 'BrokerPartyId1' });
this.brokerpartyidOptions.push({Text: 'BrokerPartyId2', Value: 'BrokerPartyId2' });
this.insurancepolicystatusidOptions.push({Text: 'InsurancePolicyStatusId1', Value: 'InsurancePolicyStatusId1' });
this.insurancepolicystatusidOptions.push({Text: 'InsurancePolicyStatusId2', Value: 'InsurancePolicyStatusId2' });
this.policytypecodeOptions.push({Text: 'INDIVIDUAL', Value: 'INDIVIDUAL' });
this.policytypecodeOptions.push({Text: 'FLEET', Value: 'FLEET' });
this.policytypecodeOptions.push({Text: 'GROUP', Value: 'GROUP' });
this.policytypecodeOptions.push({Text: 'MASTER', Value: 'MASTER' });
this.coveragetypeidOptions.push({Text: 'CoverageTypeId1', Value: 'CoverageTypeId1' });
this.coveragetypeidOptions.push({Text: 'CoverageTypeId2', Value: 'CoverageTypeId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.paymentreferenceidOptions.push({Text: 'PaymentReferenceId1', Value: 'PaymentReferenceId1' });
this.paymentreferenceidOptions.push({Text: 'PaymentReferenceId2', Value: 'PaymentReferenceId2' });
this.previouspolicyidOptions.push({Text: 'PreviousPolicyId1', Value: 'PreviousPolicyId1' });
this.previouspolicyidOptions.push({Text: 'PreviousPolicyId2', Value: 'PreviousPolicyId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insurancePolicyService.getById(this.selectedId).subscribe({
      next: data => {
        this.insurancePolicy = data;
        this.objMaster = { ...this.insurancePolicy };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsurancePolicy): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PolicyNo: obj.PolicyNo || '',
OrganisationId: obj.OrganisationId || 0,
InsurerPartyId: obj.InsurerPartyId || 0,
BrokerPartyId: obj.BrokerPartyId || 0,
InsurancePolicyStatusId: obj.InsurancePolicyStatusId || 0,
PolicyTypeCode: obj.PolicyTypeCode || '',
CoverageTypeId: obj.CoverageTypeId || 0,
PolicyStartDate:  obj.PolicyStartDate || new Date(),
PolicyEndDate:  obj.PolicyEndDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
TotalInsuredValue: obj.TotalInsuredValue || 0,
PremiumAmount: obj.PremiumAmount || 0,
TaxAmount: obj.TaxAmount || 0,
PaymentReferenceId: obj.PaymentReferenceId || 0,
PreviousPolicyId: obj.PreviousPolicyId || 0,
IssuedDate:  obj.IssuedDate || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insurancePolicys/create']);
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
    this.insurancePolicy = { ...this.objMaster };
    var obj  = this.insurancePolicy;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PolicyNo: obj.PolicyNo || '',
OrganisationId: obj.OrganisationId || 0,
InsurerPartyId: obj.InsurerPartyId || 0,
BrokerPartyId: obj.BrokerPartyId || 0,
InsurancePolicyStatusId: obj.InsurancePolicyStatusId || 0,
PolicyTypeCode: obj.PolicyTypeCode || '',
CoverageTypeId: obj.CoverageTypeId || 0,
PolicyStartDate:  obj.PolicyStartDate || new Date(),
PolicyEndDate:  obj.PolicyEndDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
TotalInsuredValue: obj.TotalInsuredValue || 0,
PremiumAmount: obj.PremiumAmount || 0,
TaxAmount: obj.TaxAmount || 0,
PaymentReferenceId: obj.PaymentReferenceId || 0,
PreviousPolicyId: obj.PreviousPolicyId || 0,
IssuedDate:  obj.IssuedDate || new Date(),
RecordStatus: obj.RecordStatus || '',
 
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
     PolicyNo: formValues.PolicyNo || null,
OrganisationId: formValues.OrganisationId || 0,
InsurerPartyId: formValues.InsurerPartyId || 0,
BrokerPartyId: formValues.BrokerPartyId || 0,
InsurancePolicyStatusId: formValues.InsurancePolicyStatusId || 0,
PolicyTypeCode: formValues.PolicyTypeCode || null,
CoverageTypeId: formValues.CoverageTypeId || 0,
PolicyStartDate: formValues.PolicyStartDate || null,
PolicyEndDate: formValues.PolicyEndDate || null,
CurrencyCode: formValues.CurrencyCode || null,
TotalInsuredValue: formValues.TotalInsuredValue || 0,
PremiumAmount: formValues.PremiumAmount || 0,
TaxAmount: formValues.TaxAmount || 0,
PaymentReferenceId: formValues.PaymentReferenceId || 0,
PreviousPolicyId: formValues.PreviousPolicyId || 0,
IssuedDate: formValues.IssuedDate || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsurancePolicy ; 
	
	  this.spinner.show(); 
    this.insurancePolicyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsurancePolicy +  'Details Updated sucessfully.');
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



