import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IQuotePricingScenario } from './quotePricingScenario';
import { QuotePricingScenarioService } from './quotePricingScenario.service';


@Component({
  selector: 'app-quotePricingScenario-edit',
  standalone: false,
  templateUrl: './quotePricingScenario-edit.component.html',
  providers: [ MessageService]
})
export class QuotePricingScenarioEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  quotePricingScenario: IQuotePricingScenario = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quoteidOptions: ISelectItem[] = [];
pricingmodecodeOptions: ISelectItem[] = [];
paymenttimingcodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IQuotePricingScenario = {} as IQuotePricingScenario;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private quotePricingScenarioService: QuotePricingScenarioService, 
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.quotePricingScenario };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScenarioName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
PricingModeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PaymentTimingCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TermMonths: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
AnnualFundingRate: new FormControl(0, []),
DownPaymentAmount: new FormControl(0, []),
BulletPaymentAmount: new FormControl(0, []),
RecordStatus: new FormControl('Active', [Validators.required, Validators.maxLength(20)]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'QuoteId', 'quotes', options => this.quoteidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.pricingmodecodeOptions = this.loggedInUserService.getPicklistOptions('PricingModeCode');
this.paymenttimingcodeOptions = this.loggedInUserService.getPicklistOptions('PaymentTimingCode');
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
    this.quotePricingScenarioService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.quotePricingScenario = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.quotePricingScenario };
        this.populateUI(this.quotePricingScenario);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IQuotePricingScenario): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
ScenarioName: obj.ScenarioName || '',
PricingModeCode: obj.PricingModeCode || '',
PaymentTimingCode: obj.PaymentTimingCode || '',
TermMonths: obj.TermMonths || 0,
AnnualFundingRate: obj.AnnualFundingRate || 0,
DownPaymentAmount: obj.DownPaymentAmount || 0,
BulletPaymentAmount: obj.BulletPaymentAmount || 0,
RecordStatus: obj.RecordStatus || 'Active',
 
      }
    );
   
	 this.Caption = "QuotePricingScenario Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/pricing-scenarios/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.quotePricingScenario = { ...this.objMaster };
	var obj  = this.quotePricingScenario;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
ScenarioName: obj.ScenarioName || '',
PricingModeCode: obj.PricingModeCode || '',
PaymentTimingCode: obj.PaymentTimingCode || '',
TermMonths: obj.TermMonths || 0,
AnnualFundingRate: obj.AnnualFundingRate || 0,
DownPaymentAmount: obj.DownPaymentAmount || 0,
BulletPaymentAmount: obj.BulletPaymentAmount || 0,
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     QuoteId:  formValues.QuoteId || null,
ScenarioName:  formValues.ScenarioName || null,
PricingModeCode:  formValues.PricingModeCode || null,
PaymentTimingCode:  formValues.PaymentTimingCode || null,
TermMonths:  formValues.TermMonths || null,
AnnualFundingRate:  formValues.AnnualFundingRate || null,
DownPaymentAmount:  formValues.DownPaymentAmount || null,
BulletPaymentAmount:  formValues.BulletPaymentAmount || null,
RecordStatus: formValues.RecordStatus || 'Active',

    } as IQuotePricingScenario ;
	
	this.spinner.show();  	   
    this.quotePricingScenarioService.update(this.quotePricingScenario.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(QuotePricingScenario +  'Details Updated sucessfully.');
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
