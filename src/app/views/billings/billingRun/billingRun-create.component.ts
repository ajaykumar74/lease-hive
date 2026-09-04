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
import { IBillingRun } from './billingRun';
import { BillingRunService } from './billingRun.service';

@Component({
  selector: 'app-billingRun-create',
  standalone: false,
  templateUrl: './billingRun-create.component.html' ,
   providers: [ MessageService]
})
export class BillingRunCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  billingRun: IBillingRun = null;
  billingorganisationidOptions: ISelectItem[] = [];
billingrunstatusidOptions: ISelectItem[] = [];
runtypeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IBillingRun = {} as IBillingRun;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private billingRunService: BillingRunService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.billingRun };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
BillingOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BillingDate: new FormControl(new Date(), [Validators.required]),
PeriodFrom: new FormControl(new Date(), []),
PeriodTo: new FormControl(new Date(), []),
BillingRunStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RunType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CandidateCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InvoiceCount: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TotalAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAtUtc: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create BillingRun';
    this.billingorganisationidOptions.push({Text: 'BillingOrganisationId1', Value: 'BillingOrganisationId1' });
this.billingorganisationidOptions.push({Text: 'BillingOrganisationId2', Value: 'BillingOrganisationId2' });
this.billingrunstatusidOptions.push({Text: 'BillingRunStatusId1', Value: 'BillingRunStatusId1' });
this.billingrunstatusidOptions.push({Text: 'BillingRunStatusId2', Value: 'BillingRunStatusId2' });
this.runtypeOptions.push({Text: 'SCHEDULED', Value: 'SCHEDULED' });
this.runtypeOptions.push({Text: 'ADHOC', Value: 'ADHOC' });
this.runtypeOptions.push({Text: 'FINAL', Value: 'FINAL' });
this.runtypeOptions.push({Text: 'ADJUSTMENT', Value: 'ADJUSTMENT' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId1', Value: 'ApprovedByUserId1' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId2', Value: 'ApprovedByUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.billingRunService.getById(this.selectedId).subscribe({
      next: data => {
        this.billingRun = data;
        this.objMaster = { ...this.billingRun };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IBillingRun): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || new Date(),
PeriodFrom:  obj.PeriodFrom || new Date(),
PeriodTo:  obj.PeriodTo || new Date(),
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billingRuns/create']);
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
    this.billingRun = { ...this.objMaster };
    var obj  = this.billingRun;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BillingOrganisationId: obj.BillingOrganisationId || 0,
BillingDate:  obj.BillingDate || new Date(),
PeriodFrom:  obj.PeriodFrom || new Date(),
PeriodTo:  obj.PeriodTo || new Date(),
BillingRunStatusId: obj.BillingRunStatusId || 0,
RunType: obj.RunType || '',
CandidateCount: obj.CandidateCount || 0,
InvoiceCount: obj.InvoiceCount || 0,
TotalAmount: obj.TotalAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAtUtc:  obj.ApprovedAtUtc || new Date(),
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
     BillingOrganisationId: formValues.BillingOrganisationId || 0,
BillingDate: formValues.BillingDate || null,
PeriodFrom: formValues.PeriodFrom || null,
PeriodTo: formValues.PeriodTo || null,
BillingRunStatusId: formValues.BillingRunStatusId || 0,
RunType: formValues.RunType || null,
CandidateCount: formValues.CandidateCount || 0,
InvoiceCount: formValues.InvoiceCount || 0,
TotalAmount: formValues.TotalAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
ApprovedAtUtc: formValues.ApprovedAtUtc || null,
RecordStatus: formValues.RecordStatus || null,

    } as IBillingRun ; 
	
	  this.spinner.show(); 
    this.billingRunService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(BillingRun +  'Details Updated sucessfully.');
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



