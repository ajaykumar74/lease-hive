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
import { IDisposalAward } from './disposalAward';
import { DisposalAwardService } from './disposalAward.service';

@Component({
  selector: 'app-disposalAward-create',
  standalone: false,
  templateUrl: './disposalAward-create.component.html' ,
   providers: [ MessageService]
})
export class DisposalAwardCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalAward: IDisposalAward = null;
  disposalcaseidOptions: ISelectItem[] = [];
awardsourcecodeOptions: ISelectItem[] = [];
disposalofferidOptions: ISelectItem[] = [];
disposalbididOptions: ISelectItem[] = [];
buyerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
approvedbyuseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDisposalAward = {} as IDisposalAward;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private disposalAwardService: DisposalAwardService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.disposalAward };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardSourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DisposalOfferId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DisposalBidId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BuyerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AwardedAt: new FormControl(new Date(), [Validators.required]),
ApprovedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create DisposalAward';
    this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.awardsourcecodeOptions.push({Text: 'OFFER', Value: 'OFFER' });
this.awardsourcecodeOptions.push({Text: 'BID', Value: 'BID' });
this.awardsourcecodeOptions.push({Text: 'NEGOTIATED', Value: 'NEGOTIATED' });
this.disposalofferidOptions.push({Text: 'DisposalOfferId1', Value: 'DisposalOfferId1' });
this.disposalofferidOptions.push({Text: 'DisposalOfferId2', Value: 'DisposalOfferId2' });
this.disposalbididOptions.push({Text: 'DisposalBidId1', Value: 'DisposalBidId1' });
this.disposalbididOptions.push({Text: 'DisposalBidId2', Value: 'DisposalBidId2' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId1', Value: 'BuyerPartyId1' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId2', Value: 'BuyerPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId1', Value: 'ApprovedByUserId1' });
this.approvedbyuseridOptions.push({Text: 'ApprovedByUserId2', Value: 'ApprovedByUserId2' });
this.statuscodeOptions.push({Text: 'AWARDED', Value: 'AWARDED' });
this.statuscodeOptions.push({Text: 'ACCEPTED', Value: 'ACCEPTED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.disposalAwardService.getById(this.selectedId).subscribe({
      next: data => {
        this.disposalAward = data;
        this.objMaster = { ...this.disposalAward };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDisposalAward): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AwardSourceCode: obj.AwardSourceCode || '',
DisposalOfferId: obj.DisposalOfferId || 0,
DisposalBidId: obj.DisposalBidId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AwardedAt:  obj.AwardedAt || new Date(),
ApprovedByUserId: obj.ApprovedByUserId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/disposalAwards/create']);
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
    this.disposalAward = { ...this.objMaster };
    var obj  = this.disposalAward;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AwardSourceCode: obj.AwardSourceCode || '',
DisposalOfferId: obj.DisposalOfferId || 0,
DisposalBidId: obj.DisposalBidId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AwardedAt:  obj.AwardedAt || new Date(),
ApprovedByUserId: obj.ApprovedByUserId || 0,
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId: formValues.DisposalCaseId || 0,
AwardSourceCode: formValues.AwardSourceCode || null,
DisposalOfferId: formValues.DisposalOfferId || 0,
DisposalBidId: formValues.DisposalBidId || 0,
BuyerPartyId: formValues.BuyerPartyId || 0,
AwardAmount: formValues.AwardAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
AwardedAt: formValues.AwardedAt || null,
ApprovedByUserId: formValues.ApprovedByUserId || 0,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IDisposalAward ; 
	
	  this.spinner.show(); 
    this.disposalAwardService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DisposalAward +  'Details Updated sucessfully.');
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



