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
import { IQuoteCharge } from './quoteCharge';
import { QuoteChargeService } from './quoteCharge.service';

@Component({
  selector: 'app-quoteCharge-create',
  standalone: false,
  templateUrl: './quoteCharge-create.component.html' ,
   providers: [ MessageService]
})
export class QuoteChargeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quoteCharge: IQuoteCharge = null;
  quoteidOptions: ISelectItem[] = [];
quoteassetidOptions: ISelectItem[] = [];
calculationtypecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IQuoteCharge = {} as IQuoteCharge;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private quoteChargeService: QuoteChargeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.quoteCharge };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
QuoteAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChargeDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
CalculationTypeCode: new FormControl('', [Validators.maxLength(20), ]), 
RateOrAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IsRecurring: new FormControl(false, [Validators.required]),
TaxCode: new FormControl('', [Validators.required, Validators.maxLength(0), ]),

    });
    this.Caption = 'Create QuoteCharge';
    this.quoteidOptions.push({Text: 'Quote1', Value: 'Quote1' });
this.quoteidOptions.push({Text: 'Quote2', Value: 'Quote2' });
this.quoteassetidOptions.push({Text: 'QuoteAsset1', Value: 'QuoteAsset1' });
this.quoteassetidOptions.push({Text: 'QuoteAsset2', Value: 'QuoteAsset2' });
this.calculationtypecodeOptions.push({Text: 'FIXED', Value: 'FIXED' });
this.calculationtypecodeOptions.push({Text: 'PERCENT', Value: 'PERCENT' });
this.calculationtypecodeOptions.push({Text: 'PER_UNIT', Value: 'PER_UNIT' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.quoteChargeService.getById(this.selectedId).subscribe({
      next: data => {
        this.quoteCharge = data;
        this.objMaster = { ...this.quoteCharge };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IQuoteCharge): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
ChargeType: obj.ChargeType || '',
ChargeDescription: obj.ChargeDescription || '',
CalculationTypeCode: obj.CalculationTypeCode || '',
RateOrAmount: obj.RateOrAmount || 0,
ChargeAmount: obj.ChargeAmount || 0,
IsRecurring:  obj.IsRecurring || false,
TaxCode: obj.TaxCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/quoteCharges/create']);
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
    this.quoteCharge = { ...this.objMaster };
    var obj  = this.quoteCharge;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
QuoteAssetId: obj.QuoteAssetId || 0,
ChargeType: obj.ChargeType || '',
ChargeDescription: obj.ChargeDescription || '',
CalculationTypeCode: obj.CalculationTypeCode || '',
RateOrAmount: obj.RateOrAmount || 0,
ChargeAmount: obj.ChargeAmount || 0,
IsRecurring:  obj.IsRecurring || false,
TaxCode: obj.TaxCode || '',
 
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
     QuoteId: formValues.QuoteId || 0,
QuoteAssetId: formValues.QuoteAssetId || 0,
ChargeType: formValues.ChargeType || null,
ChargeDescription: formValues.ChargeDescription || null,
CalculationTypeCode: formValues.CalculationTypeCode || null,
RateOrAmount: formValues.RateOrAmount || 0,
ChargeAmount: formValues.ChargeAmount || 0,
IsRecurring: formValues.IsRecurring || false,
TaxCode: formValues.TaxCode || null,

    } as IQuoteCharge ; 
	
	  this.spinner.show(); 
    this.quoteChargeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(QuoteCharge +  'Details Updated sucessfully.');
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



