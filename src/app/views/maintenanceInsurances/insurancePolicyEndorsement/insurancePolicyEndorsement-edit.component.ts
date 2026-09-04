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
import { IInsurancePolicyEndorsement } from './insurancePolicyEndorsement';
import { InsurancePolicyEndorsementService } from './insurancePolicyEndorsement.service';


@Component({
  selector: 'app-insurancePolicyEndorsement-edit',
  standalone: false,
  templateUrl: './insurancePolicyEndorsement-edit.component.html',
  providers: [ MessageService]
})
export class InsurancePolicyEndorsementEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insurancePolicyEndorsement: IInsurancePolicyEndorsement = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insurancepolicyidOptions: ISelectItem[] = [];
endorsementtypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsurancePolicyEndorsement = {} as IInsurancePolicyEndorsement;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insurancePolicyEndorsementService: InsurancePolicyEndorsementService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicyEndorsement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EndorsementNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
EndorsementTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveDate: new FormControl(new Date(), [Validators.required]),
PremiumDeltaAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId1', Value: 'InsurancePolicyId1' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId2', Value: 'InsurancePolicyId2' });
this.endorsementtypecodeOptions.push({Text: 'ADD_ASSET', Value: 'ADD_ASSET' });
this.endorsementtypecodeOptions.push({Text: 'REMOVE_ASSET', Value: 'REMOVE_ASSET' });
this.endorsementtypecodeOptions.push({Text: 'VALUE', Value: 'VALUE' });
this.endorsementtypecodeOptions.push({Text: 'DETAIL', Value: 'DETAIL' });
this.endorsementtypecodeOptions.push({Text: 'COVER', Value: 'COVER' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.statuscodeOptions.push({Text: 'SUBMITTED', Value: 'SUBMITTED' });
this.statuscodeOptions.push({Text: 'ISSUED', Value: 'ISSUED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.insurancePolicyEndorsementService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insurancePolicyEndorsement = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insurancePolicyEndorsement };
        this.populateUI(this.insurancePolicyEndorsement);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsurancePolicyEndorsement): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
EndorsementNo: obj.EndorsementNo || '',
EndorsementTypeCode: obj.EndorsementTypeCode || '',
EffectiveDate:  obj.EffectiveDate || new Date(),
PremiumDeltaAmount: obj.PremiumDeltaAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsurancePolicyEndorsement Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/policies/endorsements/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insurancePolicyEndorsement = { ...this.objMaster };
	var obj  = this.insurancePolicyEndorsement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
EndorsementNo: obj.EndorsementNo || '',
EndorsementTypeCode: obj.EndorsementTypeCode || '',
EffectiveDate:  obj.EffectiveDate || new Date(),
PremiumDeltaAmount: obj.PremiumDeltaAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
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
     InsurancePolicyId:  formValues.InsurancePolicyId || null,
EndorsementNo:  formValues.EndorsementNo || null,
EndorsementTypeCode:  formValues.EndorsementTypeCode || null,
EffectiveDate:  formValues.EffectiveDate || null,
PremiumDeltaAmount:  formValues.PremiumDeltaAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
Description:  formValues.Description || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsurancePolicyEndorsement ;
	
	this.spinner.show();  	   
    this.insurancePolicyEndorsementService.update(this.insurancePolicyEndorsement.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsurancePolicyEndorsement +  'Details Updated sucessfully.');
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
