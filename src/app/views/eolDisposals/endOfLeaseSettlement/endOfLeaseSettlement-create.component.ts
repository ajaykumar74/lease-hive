import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IEndOfLeaseSettlement } from './endOfLeaseSettlement';
import { EndOfLeaseSettlementService } from './endOfLeaseSettlement.service';

@Component({
  selector: 'app-endOfLeaseSettlement-create',
  standalone: false,
  templateUrl: './endOfLeaseSettlement-create.component.html' ,
   providers: [ MessageService]
})
export class EndOfLeaseSettlementCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endOfLeaseSettlement: IEndOfLeaseSettlement = null;
  endofleasecaseidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEndOfLeaseSettlement = {} as IEndOfLeaseSettlement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private endOfLeaseSettlementService: EndOfLeaseSettlementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseSettlement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SettlementDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
GrossChargeAmount: new FormControl(0, [Validators.required]),
GrossCreditAmount: new FormControl(0, [Validators.required]),
NetSettlementAmount: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create EndOfLeaseSettlement';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"CustomerPartyId":"CustomerPartyId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'CustomerPartyId', 'parties',
      options => this.customerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('EndOfLeaseSettlementStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovedByUserId', 'application-users',
      options => this.approvedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.endOfLeaseSettlementService.getById(this.selectedId).subscribe({
      next: data => {
        this.endOfLeaseSettlement = data;
        this.objMaster = { ...this.endOfLeaseSettlement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEndOfLeaseSettlement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SettlementDate:  obj.SettlementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
GrossChargeAmount: obj.GrossChargeAmount || 0,
GrossCreditAmount: obj.GrossCreditAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseSettlements/create']);
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
    this.endOfLeaseSettlement = { ...this.objMaster };
    var obj  = this.endOfLeaseSettlement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
SettlementDate:  obj.SettlementDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
GrossChargeAmount: obj.GrossChargeAmount || 0,
GrossCreditAmount: obj.GrossCreditAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
StatusCode: obj.StatusCode || '',
ApprovedByUserId: obj.ApprovedByUserId || 0,
ApprovedAt:  obj.ApprovedAt || new Date(),
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     EndOfLeaseCaseId: formValues.EndOfLeaseCaseId || 0,
CustomerPartyId: formValues.CustomerPartyId || 0,
SettlementDate: formValues.SettlementDate || null,
CurrencyCode: formValues.CurrencyCode || null,
GrossChargeAmount: formValues.GrossChargeAmount || 0,
GrossCreditAmount: formValues.GrossCreditAmount || 0,
NetSettlementAmount: formValues.NetSettlementAmount || 0,
StatusCode: formValues.StatusCode || null,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
ApprovedAt: formValues.ApprovedAt || null,
RecordStatus: formValues.RecordStatus || null,

    } as IEndOfLeaseSettlement ; 
	
	  this.spinner.show(); 
    this.endOfLeaseSettlementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EndOfLeaseSettlement +  'Details Updated sucessfully.');
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



