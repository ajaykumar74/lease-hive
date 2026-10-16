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
import { IPartyTenantContact } from './partyTenantContact';
import { PartyTenantContactService } from './partyTenantContact.service';

@Component({
  selector: 'app-partyTenantContact-create',
  standalone: false,
  templateUrl: './partyTenantContact-create.component.html' ,
   providers: [ MessageService]
})
export class PartyTenantContactCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyTenantContact: IPartyTenantContact = null;
  partyidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
contactrolecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyTenantContact = {} as IPartyTenantContact;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyTenantContactService: PartyTenantContactService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyTenantContact };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ContactRoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),
ReceivesSupportTickets: new FormControl(false, [Validators.required]),
ReceivesEscalations: new FormControl(false, [Validators.required]),
DisplayOrder: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), []),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.Caption = 'Create PartyTenantContact';
    this.partyidOptions.push({Text: 'PartyId1', Value: 'PartyId1' });
this.partyidOptions.push({Text: 'PartyId2', Value: 'PartyId2' });
this.applicationuseridOptions.push({Text: 'ApplicationUserId1', Value: 'ApplicationUserId1' });
this.applicationuseridOptions.push({Text: 'ApplicationUserId2', Value: 'ApplicationUserId2' });
this.contactrolecodeOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyTenantContactService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyTenantContact = data;
        this.objMaster = { ...this.partyTenantContact };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyTenantContact): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
ContactRoleCode: obj.ContactRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
ReceivesSupportTickets:  obj.ReceivesSupportTickets || false,
ReceivesEscalations:  obj.ReceivesEscalations || false,
DisplayOrder: obj.DisplayOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyTenantContacts/create']);
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
    this.partyTenantContact = { ...this.objMaster };
    var obj  = this.partyTenantContact;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
ContactRoleCode: obj.ContactRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
ReceivesSupportTickets:  obj.ReceivesSupportTickets || false,
ReceivesEscalations:  obj.ReceivesEscalations || false,
DisplayOrder: obj.DisplayOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     PartyId: formValues.PartyId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
ContactRoleCode: formValues.ContactRoleCode || null,
IsPrimary: formValues.IsPrimary || false,
ReceivesSupportTickets: formValues.ReceivesSupportTickets || false,
ReceivesEscalations: formValues.ReceivesEscalations || false,
DisplayOrder: formValues.DisplayOrder || 0,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyTenantContact ; 
	
	  this.spinner.show(); 
    this.partyTenantContactService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyTenantContact +  'Details Updated sucessfully.');
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



