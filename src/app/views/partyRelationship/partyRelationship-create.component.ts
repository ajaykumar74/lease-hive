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
import { IPartyRelationship } from './partyRelationship';
import { PartyRelationshipService } from './partyRelationship.service';

@Component({
  selector: 'app-partyRelationship-create',
  standalone: false,
  templateUrl: './partyRelationship-create.component.html' ,
   providers: [ MessageService]
})
export class PartyRelationshipCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyRelationship: IPartyRelationship = null;
  frompartyidOptions: ISelectItem[] = [];
topartyidOptions: ISelectItem[] = [];
relationshiptypeOptions: ISelectItem[] = [];
controltypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyRelationship = {} as IPartyRelationship;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyRelationshipService: PartyRelationshipService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyRelationship };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
FromPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RelationshipType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OwnershipPercentage: new FormControl(0, [Validators.required]),
ControlType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RelationshipReference: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => {
        this.frompartyidOptions = options;
        this.topartyidOptions = [...options];
      },
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.relationshiptypeOptions = this.loggedInUserService.getPicklistOptions('RelationshipType');
this.controltypeOptions = this.loggedInUserService.getPicklistOptions('ControlType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyRelationshipService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyRelationship = data;
        this.objMaster = { ...this.partyRelationship };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyRelationship): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromPartyId: obj.FromPartyId || 0,
ToPartyId: obj.ToPartyId || 0,
RelationshipType: obj.RelationshipType || '',
OwnershipPercentage: obj.OwnershipPercentage || 0,
ControlType: obj.ControlType || '',
RelationshipReference: obj.RelationshipReference || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyRelationships/create']);
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
    this.partyRelationship = { ...this.objMaster };
    var obj  = this.partyRelationship;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromPartyId: obj.FromPartyId || 0,
ToPartyId: obj.ToPartyId || 0,
RelationshipType: obj.RelationshipType || '',
OwnershipPercentage: obj.OwnershipPercentage || 0,
ControlType: obj.ControlType || '',
RelationshipReference: obj.RelationshipReference || '',
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
     FromPartyId: formValues.FromPartyId || null,
     TenantId: this.loggedInUserService.loggedInUser.Tenant.Id || 0,
ToPartyId: formValues.ToPartyId || null,
RelationshipType: formValues.RelationshipType || null,
OwnershipPercentage: formValues.OwnershipPercentage || null,
ControlType: formValues.ControlType || null,
RelationshipReference: formValues.RelationshipReference || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyRelationship ; 
	
	  this.spinner.show(); 
    this.partyRelationshipService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyRelationship +  'Details Updated sucessfully.');
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



