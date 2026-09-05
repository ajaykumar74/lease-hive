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
import { IFinanceAccountMapping } from './financeAccountMapping';
import { FinanceAccountMappingService } from './financeAccountMapping.service';

@Component({
  selector: 'app-financeAccountMapping-create',
  standalone: false,
  templateUrl: './financeAccountMapping-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceAccountMappingCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeAccountMapping: IFinanceAccountMapping = null;
  organisationidOptions: ISelectItem[] = [];
taxtypeidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceAccountMapping = {} as IFinanceAccountMapping;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeAccountMappingService: FinanceAccountMappingService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeAccountMapping };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OrganisationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EventType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ChargeTypeCode: new FormControl('', [Validators.maxLength(20), ]), 
TaxTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DebitAccountCode: new FormControl('', [Validators.maxLength(20), ]), 
CreditAccountCode: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Priority: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceAccountMapping';
    this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.taxtypeidOptions.push({Text: 'TaxTypeId1', Value: 'TaxTypeId1' });
this.taxtypeidOptions.push({Text: 'TaxTypeId2', Value: 'TaxTypeId2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeAccountMappingService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeAccountMapping = data;
        this.objMaster = { ...this.financeAccountMapping };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceAccountMapping): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
ChargeTypeCode: obj.ChargeTypeCode || '',
TaxTypeId: obj.TaxTypeId || 0,
DebitAccountCode: obj.DebitAccountCode || '',
CreditAccountCode: obj.CreditAccountCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Priority: obj.Priority || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeAccountMappings/create']);
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
    this.financeAccountMapping = { ...this.objMaster };
    var obj  = this.financeAccountMapping;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
ChargeTypeCode: obj.ChargeTypeCode || '',
TaxTypeId: obj.TaxTypeId || 0,
DebitAccountCode: obj.DebitAccountCode || '',
CreditAccountCode: obj.CreditAccountCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Priority: obj.Priority || 0,
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
     OrganisationId: formValues.OrganisationId || 0,
EventType: formValues.EventType || null,
ChargeTypeCode: formValues.ChargeTypeCode || null,
TaxTypeId: formValues.TaxTypeId || 0,
DebitAccountCode: formValues.DebitAccountCode || null,
CreditAccountCode: formValues.CreditAccountCode || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
Priority: formValues.Priority || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceAccountMapping ; 
	
	  this.spinner.show(); 
    this.financeAccountMappingService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceAccountMapping +  'Details Updated sucessfully.');
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



