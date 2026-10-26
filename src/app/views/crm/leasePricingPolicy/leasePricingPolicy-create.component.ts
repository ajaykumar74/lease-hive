import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ILeasePricingPolicy } from './leasePricingPolicy';
import { LeasePricingPolicyService } from './leasePricingPolicy.service';

@Component({
  selector: 'app-leasePricingPolicy-create',
  standalone: false,
  templateUrl: './leasePricingPolicy-create.component.html' ,
   providers: [ MessageService]
})
export class LeasePricingPolicyCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasePricingPolicy: ILeasePricingPolicy = null;
  assetcategoryidOptions: ISelectItem[] = [];
defaultpricingmodecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeasePricingPolicy = {} as ILeasePricingPolicy;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leasePricingPolicyService: LeasePricingPolicyService,
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leasePricingPolicy };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PolicyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PolicyName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
DefaultPricingModeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DefaultFundingRate: new FormControl(0, []),
MinimumFundingRate: new FormControl(0, []),
MaximumTermMonths: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
MinimumDownPaymentPct: new FormControl(0, []),
MaximumResidualPct: new FormControl(0, []),
LeaseTypeCode: new FormControl('', [Validators.maxLength(20)]),
MaximumFundingRate: new FormControl(null, []),
MaximumContractValue: new FormControl(null, []),
MaximumDiscountAmount: new FormControl(null, []),
ApprovalThresholdAmount: new FormControl(null, []),
ExceptionThresholdAmount: new FormControl(null, []),
RequireCommercialApproval: new FormControl(false, []),
BlockPolicyViolations: new FormControl(true, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create LeasePricingPolicy';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories', options => this.assetcategoryidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
    this.defaultpricingmodecodeOptions = this.loggedInUserService.getPicklistOptions('PricingModeCode');
    this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leasePricingPolicyService.getById(this.selectedId).subscribe({
      next: data => {
        this.leasePricingPolicy = data;
        this.objMaster = { ...this.leasePricingPolicy };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeasePricingPolicy): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
PolicyCode: obj.PolicyCode || '',
PolicyName: obj.PolicyName || '',
DefaultPricingModeCode: obj.DefaultPricingModeCode || '',
DefaultFundingRate: obj.DefaultFundingRate || 0,
MinimumFundingRate: obj.MinimumFundingRate || 0,
MaximumTermMonths: obj.MaximumTermMonths || 0,
MinimumDownPaymentPct: obj.MinimumDownPaymentPct || 0,
MaximumResidualPct: obj.MaximumResidualPct || 0,
LeaseTypeCode: obj.LeaseTypeCode || '',
MaximumFundingRate: obj.MaximumFundingRate ?? null,
MaximumContractValue: obj.MaximumContractValue ?? null,
MaximumDiscountAmount: obj.MaximumDiscountAmount ?? null,
ApprovalThresholdAmount: obj.ApprovalThresholdAmount ?? null,
ExceptionThresholdAmount: obj.ExceptionThresholdAmount ?? null,
RequireCommercialApproval: !!obj.RequireCommercialApproval,
BlockPolicyViolations: obj.BlockPolicyViolations !== false,
CurrencyCode: obj.CurrencyCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/config/lease-pricing-policies/create']);
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
    this.leasePricingPolicy = { ...this.objMaster };
    var obj  = this.leasePricingPolicy;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
PolicyCode: obj.PolicyCode || '',
PolicyName: obj.PolicyName || '',
DefaultPricingModeCode: obj.DefaultPricingModeCode || '',
DefaultFundingRate: obj.DefaultFundingRate || 0,
MinimumFundingRate: obj.MinimumFundingRate || 0,
MaximumTermMonths: obj.MaximumTermMonths || 0,
MinimumDownPaymentPct: obj.MinimumDownPaymentPct || 0,
MaximumResidualPct: obj.MaximumResidualPct || 0,
LeaseTypeCode: obj.LeaseTypeCode || '',
MaximumFundingRate: obj.MaximumFundingRate ?? null,
MaximumContractValue: obj.MaximumContractValue ?? null,
MaximumDiscountAmount: obj.MaximumDiscountAmount ?? null,
ApprovalThresholdAmount: obj.ApprovalThresholdAmount ?? null,
ExceptionThresholdAmount: obj.ExceptionThresholdAmount ?? null,
RequireCommercialApproval: !!obj.RequireCommercialApproval,
BlockPolicyViolations: obj.BlockPolicyViolations !== false,
CurrencyCode: obj.CurrencyCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     AssetCategoryId: formValues.AssetCategoryId || 0,
PolicyCode: formValues.PolicyCode || null,
PolicyName: formValues.PolicyName || null,
DefaultPricingModeCode: formValues.DefaultPricingModeCode || null,
DefaultFundingRate: formValues.DefaultFundingRate || 0,
MinimumFundingRate: formValues.MinimumFundingRate || 0,
MaximumTermMonths: formValues.MaximumTermMonths || null,
MinimumDownPaymentPct: formValues.MinimumDownPaymentPct || 0,
MaximumResidualPct: formValues.MaximumResidualPct || 0,
LeaseTypeCode: formValues.LeaseTypeCode || null,
MaximumFundingRate: formValues.MaximumFundingRate ?? null,
MaximumContractValue: formValues.MaximumContractValue ?? null,
MaximumDiscountAmount: formValues.MaximumDiscountAmount ?? null,
ApprovalThresholdAmount: formValues.ApprovalThresholdAmount ?? null,
ExceptionThresholdAmount: formValues.ExceptionThresholdAmount ?? null,
RequireCommercialApproval: !!formValues.RequireCommercialApproval,
BlockPolicyViolations: formValues.BlockPolicyViolations !== false,
CurrencyCode: formValues.CurrencyCode || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as ILeasePricingPolicy ; 
	
	  this.spinner.show(); 
    this.leasePricingPolicyService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeasePricingPolicy +  'Details Updated sucessfully.');
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



