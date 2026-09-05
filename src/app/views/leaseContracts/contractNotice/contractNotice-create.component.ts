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
import { IContractNotice } from './contractNotice';
import { ContractNoticeService } from './contractNotice.service';

@Component({
  selector: 'app-contractNotice-create',
  standalone: false,
  templateUrl: './contractNotice-create.component.html' ,
   providers: [ MessageService]
})
export class ContractNoticeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractNotice: IContractNotice = null;
  leasecontractidOptions: ISelectItem[] = [];
noticetypecodeOptions: ISelectItem[] = [];
recipientpartyidOptions: ISelectItem[] = [];
deliverymethodcodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
deliverystatuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractNotice = {} as IContractNotice;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractNoticeService: ContractNoticeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractNotice };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
NoticeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NoticeDate: new FormControl(new Date(), [Validators.required]),
EffectiveDate: new FormControl(new Date(), []),
RecipientPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DeliveryMethodCode: new FormControl('', [Validators.maxLength(20), ]), 
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DeliveryStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SentOn: new FormControl(new Date(), []),

    });
    this.Caption = 'Create ContractNotice';
    this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.noticetypecodeOptions = this.loggedInUserService.getPicklistOptions('ContractNoticeNoticeTypeCode');
this.recipientpartyidOptions.push({Text: 'RecipientPartyId1', Value: 'RecipientPartyId1' });
this.recipientpartyidOptions.push({Text: 'RecipientPartyId2', Value: 'RecipientPartyId2' });
this.deliverymethodcodeOptions = this.loggedInUserService.getPicklistOptions('DeliveryMethodCode');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.deliverystatuscodeOptions = this.loggedInUserService.getPicklistOptions('DeliveryStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractNoticeService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractNotice = data;
        this.objMaster = { ...this.contractNotice };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractNotice): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
NoticeTypeCode: obj.NoticeTypeCode || '',
NoticeDate:  obj.NoticeDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
RecipientPartyId: obj.RecipientPartyId || 0,
DeliveryMethodCode: obj.DeliveryMethodCode || '',
DocumentId: obj.DocumentId || 0,
DeliveryStatusCode: obj.DeliveryStatusCode || '',
SentOn:  obj.SentOn || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractNotices/create']);
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
    this.contractNotice = { ...this.objMaster };
    var obj  = this.contractNotice;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
NoticeTypeCode: obj.NoticeTypeCode || '',
NoticeDate:  obj.NoticeDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
RecipientPartyId: obj.RecipientPartyId || 0,
DeliveryMethodCode: obj.DeliveryMethodCode || '',
DocumentId: obj.DocumentId || 0,
DeliveryStatusCode: obj.DeliveryStatusCode || '',
SentOn:  obj.SentOn || new Date(),
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
NoticeTypeCode: formValues.NoticeTypeCode || null,
NoticeDate: formValues.NoticeDate || null,
EffectiveDate: formValues.EffectiveDate || null,
RecipientPartyId: formValues.RecipientPartyId || 0,
DeliveryMethodCode: formValues.DeliveryMethodCode || null,
DocumentId: formValues.DocumentId || 0,
DeliveryStatusCode: formValues.DeliveryStatusCode || null,
SentOn: formValues.SentOn || null,

    } as IContractNotice ; 
	
	  this.spinner.show(); 
    this.contractNoticeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractNotice +  'Details Updated sucessfully.');
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



