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
import { ICreditLimit } from './creditLimit';
import { CreditLimitService } from './creditLimit.service';


@Component({
  selector: 'app-creditLimit-edit',
  standalone: false,
  templateUrl: './creditLimit-edit.component.html',
  providers: [ MessageService]
})
export class CreditLimitEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  creditLimit: ICreditLimit = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
organisationidOptions: ISelectItem[] = [];
creditdecisionidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
limitstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ICreditLimit = {} as ICreditLimit;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private creditLimitService: CreditLimitService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.creditLimit };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CreditDecisionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LimitAmount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
LimitStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.partyidOptions.push({Text: 'Part1', Value: 'Part1' });
this.partyidOptions.push({Text: 'Part2', Value: 'Part2' });
this.organisationidOptions.push({Text: 'Org1', Value: 'Org1' });
this.organisationidOptions.push({Text: 'Org2', Value: 'Org2' });
this.creditdecisionidOptions.push({Text: 'CreditDesc1', Value: 'CreditDesc1' });
this.creditdecisionidOptions.push({Text: 'CreditDesc2', Value: 'CreditDesc2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.limitstatusOptions.push({Text: 'Active', Value: 'Active' });
this.limitstatusOptions.push({Text: 'Suspended', Value: 'Suspended' });
this.limitstatusOptions.push({Text: 'Expired', Value: 'Expired' });
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
    this.creditLimitService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.creditLimit = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.creditLimit };
        this.populateUI(this.creditLimit);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ICreditLimit): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
OrganisationId: obj.OrganisationId || 0,
CreditDecisionId: obj.CreditDecisionId || 0,
CurrencyCode: obj.CurrencyCode || '',
LimitAmount: obj.LimitAmount || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
LimitStatus: obj.LimitStatus || '',
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "CreditLimit Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/credit/limits/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.creditLimit = { ...this.objMaster };
	var obj  = this.creditLimit;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
OrganisationId: obj.OrganisationId || 0,
CreditDecisionId: obj.CreditDecisionId || 0,
CurrencyCode: obj.CurrencyCode || '',
LimitAmount: obj.LimitAmount || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
LimitStatus: obj.LimitStatus || '',
Remarks: obj.Remarks || '',
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
     PartyId:  formValues.PartyId || null,
OrganisationId:  formValues.OrganisationId || null,
CreditDecisionId:  formValues.CreditDecisionId || null,
CurrencyCode:  formValues.CurrencyCode || null,
LimitAmount:  formValues.LimitAmount || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
LimitStatus:  formValues.LimitStatus || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ICreditLimit ;
	
	this.spinner.show();  	   
    this.creditLimitService.update(this.creditLimit.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(CreditLimit +  'Details Updated sucessfully.');
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
