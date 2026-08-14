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
import { IUserPartyAccess } from './userPartyAccess';
import { UserPartyAccessService } from './userPartyAccess.service';

@Component({
  selector: 'app-userPartyAccess-create',
  standalone: false,
  templateUrl: './userPartyAccess-create.component.html' ,
   providers: [ MessageService]
})
export class UserPartyAccessCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  userPartyAccess: IUserPartyAccess = null;
  partyidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
partyroletypeOptions: ISelectItem[] = [];
accesslevelOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
customerdepartmentidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IUserPartyAccess = {} as IUserPartyAccess;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private userPartyAccessService: UserPartyAccessService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.userPartyAccess };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyRoleType: new FormControl('', [Validators.maxLength(20), ]), 
AccessLevel: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PartyLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerDepartmentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.loggedInUserService.getApplicationUserOptions().subscribe({
  next: options => this.applicationuseridOptions = options,
  error: err => setTimeout(() => this.messageService?.showError(err))
});
this.partyroletypeOptions = this.loggedInUserService.getPicklistOptions('PartyRoleType');
this.accesslevelOptions = this.loggedInUserService.getPicklistOptions('AccessLevel');
    this.loggedInUserService.getLookupOptions('customer-departments').subscribe({
      next: options => this.customerdepartmentidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-locations').subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.userPartyAccessService.getById(this.selectedId).subscribe({
      next: data => {
        this.userPartyAccess = data;
        this.objMaster = { ...this.userPartyAccess };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IUserPartyAccess): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
PartyRoleType: obj.PartyRoleType || '',
AccessLevel: obj.AccessLevel || '',
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/userPartyAccesss/create']);
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
    this.userPartyAccess = { ...this.objMaster };
    var obj  = this.userPartyAccess;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
PartyRoleType: obj.PartyRoleType || '',
AccessLevel: obj.AccessLevel || '',
PartyLocationId: obj.PartyLocationId || 0,
CustomerDepartmentId: obj.CustomerDepartmentId || 0,
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
     PartyId: formValues.PartyId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
PartyRoleType: formValues.PartyRoleType || null,
AccessLevel: formValues.AccessLevel || null,
PartyLocationId: formValues.PartyLocationId || 0,
CustomerDepartmentId: formValues.CustomerDepartmentId || 0,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IUserPartyAccess ; 
	
	  this.spinner.show(); 
    this.userPartyAccessService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(UserPartyAccess +  'Details Updated sucessfully.');
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



