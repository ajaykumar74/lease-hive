import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-insurancePolicy-edit',
  standalone: false,
  templateUrl: './insurancePolicy-edit.component.html',
  providers: [ MessageService]
})
export class InsurancePolicyEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  insurancePolicy: IInsurancePolicy = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insurancePolicyService: InsurancePolicyService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicy };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
      options => this.organisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'InsurerPartyId', 'parties',
      options => this.insurerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BrokerPartyId', 'parties',
      options => this.brokerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'InsurancePolicyStatusId', 'insurance-policy-statuses',
      options => this.insurancepolicystatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.policytypecodeOptions = this.loggedInUserService.getPicklistOptions('PolicyTypeCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'CoverageTypeId', 'insurance-coverage-types',
      options => this.coveragetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.paymentreferenceidOptions.push({Text: 'PaymentReferenceId1', Value: 'PaymentReferenceId1' });
this.paymentreferenceidOptions.push({Text: 'PaymentReferenceId2', Value: 'PaymentReferenceId2' });
this.loggedInUserService.bindEntityLookup(this.editForm, 'PreviousPolicyId', 'insurance-policies',
      options => this.previouspolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"OrganisationId":"OrganisationId"});
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.insurancePolicyService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insurancePolicy = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insurancePolicy };
        this.populateUI(this.insurancePolicy);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "InsurancePolicy Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/policies/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PolicyNo:  formValues.PolicyNo || null,
OrganisationId:  formValues.OrganisationId || null,
InsurerPartyId:  formValues.InsurerPartyId || null,
BrokerPartyId:  formValues.BrokerPartyId || null,
InsurancePolicyStatusId:  formValues.InsurancePolicyStatusId || null,
PolicyTypeCode:  formValues.PolicyTypeCode || null,
CoverageTypeId:  formValues.CoverageTypeId || null,
PolicyStartDate:  formValues.PolicyStartDate || null,
PolicyEndDate:  formValues.PolicyEndDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
TotalInsuredValue:  formValues.TotalInsuredValue || null,
PremiumAmount:  formValues.PremiumAmount || null,
TaxAmount:  formValues.TaxAmount || null,
PaymentReferenceId:  formValues.PaymentReferenceId || null,
PreviousPolicyId:  formValues.PreviousPolicyId || null,
IssuedDate:  formValues.IssuedDate || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsurancePolicy ;
	
	this.spinner.show();  	   
    this.insurancePolicyService.update(this.insurancePolicy.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsurancePolicy +  'Details Updated sucessfully.');
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
