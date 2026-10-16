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
import { ISupportTicket } from './supportTicket';
import { SupportTicketService } from './supportTicket.service';

@Component({
  selector: 'app-supportTicket-create',
  standalone: false,
  templateUrl: './supportTicket-create.component.html' ,
   providers: [ MessageService]
})
export class SupportTicketCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supportTicket: ISupportTicket = null;
  partyidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
customerprofileidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
assetuseridOptions: ISelectItem[] = [];
requesterapplicationuseridOptions: ISelectItem[] = [];
requesterpartycontactidOptions: ISelectItem[] = [];
assignedtoapplicationuseridOptions: ISelectItem[] = [];
sourcecodeOptions: ISelectItem[] = [];
tickettypecodeOptions: ISelectItem[] = [];
categorycodeOptions: ISelectItem[] = [];
prioritycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ISupportTicket = {} as ISupportTicket;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private supportTicketService: SupportTicketService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.supportTicket };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerProfileId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequesterApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RequesterPartyContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedToApplicationUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TicketTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CategoryCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PriorityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Subject: new FormControl('', [Validators.required, Validators.maxLength(250), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ResolutionSummary: new FormControl('', [Validators.maxLength(2000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create SupportTicket';
    this.partyidOptions.push({Text: 'PartyId1', Value: 'PartyId1' });
this.partyidOptions.push({Text: 'PartyId2', Value: 'PartyId2' });
this.partylocationidOptions.push({Text: 'PartyLocationId1', Value: 'PartyLocationId1' });
this.partylocationidOptions.push({Text: 'PartyLocationId2', Value: 'PartyLocationId2' });
this.customerprofileidOptions.push({Text: 'CustomerProfileId1', Value: 'CustomerProfileId1' });
this.customerprofileidOptions.push({Text: 'CustomerProfileId2', Value: 'CustomerProfileId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.assetuseridOptions.push({Text: 'AssetUserId1', Value: 'AssetUserId1' });
this.assetuseridOptions.push({Text: 'AssetUserId2', Value: 'AssetUserId2' });
this.requesterapplicationuseridOptions.push({Text: 'RequesterApplicationUserId1', Value: 'RequesterApplicationUserId1' });
this.requesterapplicationuseridOptions.push({Text: 'RequesterApplicationUserId2', Value: 'RequesterApplicationUserId2' });
this.requesterpartycontactidOptions.push({Text: 'RequesterPartyContactId1', Value: 'RequesterPartyContactId1' });
this.requesterpartycontactidOptions.push({Text: 'RequesterPartyContactId2', Value: 'RequesterPartyContactId2' });
this.assignedtoapplicationuseridOptions.push({Text: 'AssignedToApplicationUserId1', Value: 'AssignedToApplicationUserId1' });
this.assignedtoapplicationuseridOptions.push({Text: 'AssignedToApplicationUserId2', Value: 'AssignedToApplicationUserId2' });
this.sourcecodeOptions.push({Text: '', Value: '' });
this.tickettypecodeOptions.push({Text: '', Value: '' });
this.categorycodeOptions.push({Text: '', Value: '' });
this.prioritycodeOptions.push({Text: '', Value: '' });
this.statuscodeOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.supportTicketService.getById(this.selectedId).subscribe({
      next: data => {
        this.supportTicket = data;
        this.objMaster = { ...this.supportTicket };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ISupportTicket): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerProfileId: obj.CustomerProfileId || 0,
LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
AssetUserId: obj.AssetUserId || 0,
RequesterApplicationUserId: obj.RequesterApplicationUserId || 0,
RequesterPartyContactId: obj.RequesterPartyContactId || 0,
AssignedToApplicationUserId: obj.AssignedToApplicationUserId || 0,
SourceCode: obj.SourceCode || '',
TicketTypeCode: obj.TicketTypeCode || '',
CategoryCode: obj.CategoryCode || '',
PriorityCode: obj.PriorityCode || '',
StatusCode: obj.StatusCode || '',
Subject: obj.Subject || '',
Description: obj.Description || '',
ResolutionSummary: obj.ResolutionSummary || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/supportTickets/create']);
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
    this.supportTicket = { ...this.objMaster };
    var obj  = this.supportTicket;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
CustomerProfileId: obj.CustomerProfileId || 0,
LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
AssetUserId: obj.AssetUserId || 0,
RequesterApplicationUserId: obj.RequesterApplicationUserId || 0,
RequesterPartyContactId: obj.RequesterPartyContactId || 0,
AssignedToApplicationUserId: obj.AssignedToApplicationUserId || 0,
SourceCode: obj.SourceCode || '',
TicketTypeCode: obj.TicketTypeCode || '',
CategoryCode: obj.CategoryCode || '',
PriorityCode: obj.PriorityCode || '',
StatusCode: obj.StatusCode || '',
Subject: obj.Subject || '',
Description: obj.Description || '',
ResolutionSummary: obj.ResolutionSummary || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     PartyId: formValues.PartyId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
CustomerProfileId: formValues.CustomerProfileId || 0,
LeaseContractId: formValues.LeaseContractId || 0,
AssetId: formValues.AssetId || 0,
AssetUserId: formValues.AssetUserId || 0,
RequesterApplicationUserId: formValues.RequesterApplicationUserId || 0,
RequesterPartyContactId: formValues.RequesterPartyContactId || 0,
AssignedToApplicationUserId: formValues.AssignedToApplicationUserId || 0,
SourceCode: formValues.SourceCode || null,
TicketTypeCode: formValues.TicketTypeCode || null,
CategoryCode: formValues.CategoryCode || null,
PriorityCode: formValues.PriorityCode || null,
StatusCode: formValues.StatusCode || null,
Subject: formValues.Subject || null,
Description: formValues.Description || null,
ResolutionSummary: formValues.ResolutionSummary || null,
RecordStatus: formValues.RecordStatus || null,

    } as ISupportTicket ; 
	
	  this.spinner.show(); 
    this.supportTicketService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(SupportTicket +  'Details Updated sucessfully.');
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



