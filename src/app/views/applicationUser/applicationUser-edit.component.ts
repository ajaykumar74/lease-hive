import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-applicationUser-edit',
  standalone: false,
  templateUrl: './applicationUser-edit.component.html',
  providers: [ MessageService]
})
export class ApplicationUserEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  applicationUser: IApplicationUser = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  identityproviderOptions: ISelectItem[] = [];
usertypeOptions: ISelectItem[] = [];
partycontactidOptions: ISelectItem[] = [];
assetuseridOptions: ISelectItem[] = [];
defaultorganisationunitidOptions: ISelectItem[] = [];
timezoneidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IApplicationUser = {} as IApplicationUser;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private applicationUserService: ApplicationUserService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.applicationUser };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.identityproviderOptions.push({Text: '"Local', Value: '"Local' });
this.usertypeOptions.push({Text: 'Internal', Value: 'Internal' });
this.usertypeOptions.push({Text: 'Customer', Value: 'Customer' });
this.usertypeOptions.push({Text: 'Supplier', Value: 'Supplier' });
this.usertypeOptions.push({Text: 'Auditor', Value: 'Auditor' });
this.usertypeOptions.push({Text: 'APIService', Value: 'APIService' });
this.partycontactidOptions.push({Text: 'PartyContact1', Value: 'PartyContact1' });
this.partycontactidOptions.push({Text: 'PartyContact2', Value: 'PartyContact2' });
this.assetuseridOptions.push({Text: 'AssetUser1', Value: 'AssetUser1' });
this.assetuseridOptions.push({Text: 'AssetUser2', Value: 'AssetUser2' });
this.defaultorganisationunitidOptions.push({Text: 'OrganisationUnit1', Value: 'OrganisationUnit1' });
this.defaultorganisationunitidOptions.push({Text: 'OrganisationUnit2', Value: 'OrganisationUnit2' });
this.timezoneidOptions.push({Text: 'IST', Value: 'IST' });
this.timezoneidOptions.push({Text: 'UTC', Value: 'UTC' });
this.timezoneidOptions.push({Text: 'PST', Value: 'PST' });
this.timezoneidOptions.push({Text: 'CST', Value: 'CST' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.applicationUserService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.applicationUser = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.applicationUser };
        this.populateUI(this.applicationUser);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "ApplicationUser Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/applicationUser/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     UserName:  formValues.UserName || null,
DisplayName:  formValues.DisplayName || null,
Email:  formValues.Email || null,
MobileCountryCode:  formValues.MobileCountryCode || null,
MobileNumber:  formValues.MobileNumber || null,
IdentityProvider:  formValues.IdentityProvider || null,
ExternalSubjectId:  formValues.ExternalSubjectId || null,
UserType:  formValues.UserType || null,
PartyContactId:  formValues.PartyContactId || null,
AssetUserId:  formValues.AssetUserId || null,
DefaultOrganisationUnitId:  formValues.DefaultOrganisationUnitId || null,
TimeZoneId:  formValues.TimeZoneId || null,
LastLoginDateTime:  formValues.LastLoginDateTime || null,
FailedLoginCount:  formValues.FailedLoginCount || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IApplicationUser ;
	
	this.spinner.show();  	   
    this.applicationUserService.update(this.applicationUser.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ApplicationUser +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
