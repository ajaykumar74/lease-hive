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
import { IApplicationUser } from './applicationUser';
import { ApplicationUserService } from './applicationUser.service';

@Component({
  selector: 'app-applicationUser-create',
  standalone: false,
  templateUrl: './applicationUser-create.component.html' ,
   providers: [ MessageService]
})
export class ApplicationUserCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Application User';
  applicationUser: IApplicationUser = null;
  identityproviderOptions: ISelectItem[] = [];
usertypeOptions: ISelectItem[] = [];
partycontactidOptions: ISelectItem[] = [];
assetuseridOptions: ISelectItem[] = [];
defaultorganisationunitidOptions: ISelectItem[] = [];
timezoneidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IApplicationUser = {} as IApplicationUser;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private applicationUserService: ApplicationUserService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.applicationUser };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
UserName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
DisplayName: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Email: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
MobileCountryCode: new FormControl('', [Validators.required, Validators.maxLength(5), ]),
MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
IdentityProvider: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
ExternalSubjectId: new FormControl('', [Validators.maxLength(30), ]), 
UserType: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
PartyContactId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultOrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TimeZoneId: new FormControl('', [Validators.maxLength(20), ]), 
LastLoginDateTime: new FormControl(new Date(), []),
FailedLoginCount: new FormControl(0, [Validators.min(0), Validators.max(255)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.identityproviderOptions = this.loggedInUserService.getPicklistOptions('IdentityProvider');
this.usertypeOptions = this.loggedInUserService.getPicklistOptions('UserType');
this.timezoneidOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
    this.loggedInUserService.getLookupOptions('asset-users').subscribe({
      next: options => this.assetuseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.defaultorganisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('party-contacts').subscribe({
      next: options => this.partycontactidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.applicationUserService.getById(this.selectedId).subscribe({
      next: data => {
        this.applicationUser = data;
        this.objMaster = { ...this.applicationUser };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IApplicationUser): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  UserName: obj.UserName || '',
DisplayName: obj.DisplayName || '',
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
IdentityProvider: obj.IdentityProvider || '',
ExternalSubjectId: obj.ExternalSubjectId || '',
UserType: obj.UserType || '',
PartyContactId: obj.PartyContactId || 0,
AssetUserId: obj.AssetUserId || 0,
DefaultOrganisationUnitId: obj.DefaultOrganisationUnitId || 0,
TimeZoneId: obj.TimeZoneId || '',
LastLoginDateTime:  obj.LastLoginDateTime || new Date(),
FailedLoginCount: obj.FailedLoginCount || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/applicationUsers/create']);
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
    this.applicationUser = { ...this.objMaster };
    var obj  = this.applicationUser;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  UserName: obj.UserName || '',
DisplayName: obj.DisplayName || '',
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
IdentityProvider: obj.IdentityProvider || '',
ExternalSubjectId: obj.ExternalSubjectId || '',
UserType: obj.UserType || '',
PartyContactId: obj.PartyContactId || 0,
AssetUserId: obj.AssetUserId || 0,
DefaultOrganisationUnitId: obj.DefaultOrganisationUnitId || 0,
TimeZoneId: obj.TimeZoneId || '',
LastLoginDateTime:  obj.LastLoginDateTime || new Date(),
FailedLoginCount: obj.FailedLoginCount || 0,
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
     UserName: formValues.UserName || null,
DisplayName: formValues.DisplayName || null,
Email: formValues.Email || null,
MobileCountryCode: formValues.MobileCountryCode || null,
MobileNumber: formValues.MobileNumber || null,
IdentityProvider: formValues.IdentityProvider || null,
ExternalSubjectId: formValues.ExternalSubjectId || null,
UserType: formValues.UserType || null,
PartyContactId: formValues.PartyContactId || 0,
AssetUserId: formValues.AssetUserId || 0,
DefaultOrganisationUnitId: formValues.DefaultOrganisationUnitId || 0,
TimeZoneId: formValues.TimeZoneId || null,
LastLoginDateTime: formValues.LastLoginDateTime || null,
FailedLoginCount: formValues.FailedLoginCount || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IApplicationUser ; 
	
	  this.spinner.show(); 
    this.applicationUserService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ApplicationUser +  'Details Updated sucessfully.');
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



