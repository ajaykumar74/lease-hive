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
import { IQuotePricingSchedule } from './quotePricingSchedule';
import { QuotePricingScheduleService } from './quotePricingSchedule.service';

@Component({
  selector: 'app-quotePricingSchedule-create',
  standalone: false,
  templateUrl: './quotePricingSchedule-create.component.html' ,
   providers: [ MessageService]
})
export class QuotePricingScheduleCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quotePricingSchedule: IQuotePricingSchedule = null;
  quotepricingscenarioidOptions: ISelectItem[] = [];
  quoteassetidOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];
  
  editForm: any; 
  objMaster : IQuotePricingSchedule = {} as IQuotePricingSchedule;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private quotePricingScheduleService: QuotePricingScheduleService,
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.quotePricingSchedule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
     QuotePricingScenarioId: new FormControl(0, [Validators.required, Validators.min(1)]),
     QuoteAssetId: new FormControl(0, []),
     PeriodNo: new FormControl(0, [Validators.required, Validators.min(1)]),
     PaymentDueDate: new FormControl(null, []),
     OpeningBalance: new FormControl(0, []),
     FinanceCharge: new FormControl(0, []),
     PrincipalRecovery: new FormControl(0, []),
     BaseRentalAmount: new FormControl(0, [Validators.required]),
     ServiceAmount: new FormControl(0, []),
     BulletAmount: new FormControl(0, []),
     ClosingBalance: new FormControl(0, []),
     RecordStatus: new FormControl('Active', [Validators.required]),

    });
    this.Caption = 'Create QuotePricingSchedule';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'QuotePricingScenarioId', 'quote-pricing-scenarios', options => this.quotepricingscenarioidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
    this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteAssetId', 'quote-assets', options => this.quoteassetidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.quotePricingScheduleService.getById(this.selectedId).subscribe({
      next: data => {
        this.quotePricingSchedule = data;
        this.objMaster = { ...this.quotePricingSchedule };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IQuotePricingSchedule): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
       QuotePricingScenarioId: obj.QuotePricingScenarioId || 0,
       QuoteAssetId: obj.QuoteAssetId || 0,
       PeriodNo: obj.PeriodNo || 0,
       PaymentDueDate: obj.PaymentDueDate || null,
       OpeningBalance: obj.OpeningBalance || 0,
       FinanceCharge: obj.FinanceCharge || 0,
       PrincipalRecovery: obj.PrincipalRecovery || 0,
       BaseRentalAmount: obj.BaseRentalAmount || 0,
       ServiceAmount: obj.ServiceAmount || 0,
       BulletAmount: obj.BulletAmount || 0,
       ClosingBalance: obj.ClosingBalance || 0,
       RecordStatus: obj.RecordStatus || 'Active',
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/pricing-schedules/create']);
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
    this.quotePricingSchedule = { ...this.objMaster };
    var obj  = this.quotePricingSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
       QuotePricingScenarioId: obj.QuotePricingScenarioId || 0,
       QuoteAssetId: obj.QuoteAssetId || 0,
       PeriodNo: obj.PeriodNo || 0,
       PaymentDueDate: obj.PaymentDueDate || null,
       OpeningBalance: obj.OpeningBalance || 0,
       FinanceCharge: obj.FinanceCharge || 0,
       PrincipalRecovery: obj.PrincipalRecovery || 0,
       BaseRentalAmount: obj.BaseRentalAmount || 0,
       ServiceAmount: obj.ServiceAmount || 0,
       BulletAmount: obj.BulletAmount || 0,
       ClosingBalance: obj.ClosingBalance || 0,
       RecordStatus: obj.RecordStatus || 'Active',
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
      QuotePricingScenarioId: formValues.QuotePricingScenarioId,
      QuoteAssetId: formValues.QuoteAssetId || 0,
      PeriodNo: formValues.PeriodNo,
      PaymentDueDate: formValues.PaymentDueDate || null,
      OpeningBalance: formValues.OpeningBalance || 0,
      FinanceCharge: formValues.FinanceCharge || 0,
      PrincipalRecovery: formValues.PrincipalRecovery || 0,
      BaseRentalAmount: formValues.BaseRentalAmount || 0,
      ServiceAmount: formValues.ServiceAmount || 0,
      BulletAmount: formValues.BulletAmount || 0,
      ClosingBalance: formValues.ClosingBalance || 0,
      RecordStatus: formValues.RecordStatus || 'Active',
    } as IQuotePricingSchedule ; 
	
	  this.spinner.show(); 
    this.quotePricingScheduleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(QuotePricingSchedule +  'Details Updated sucessfully.');
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



