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
import { IUserOrganisationUnit } from './userOrganisationUnit';
import { UserOrganisationUnitService } from './userOrganisationUnit.service';

@Component({
  selector: 'app-userOrganisationUnit-create',
  standalone: false,
  templateUrl: './userOrganisationUnit-create.component.html' ,
   providers: [ MessageService]
})
export class UserOrganisationUnitCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  userOrganisationUnit: IUserOrganisationUnit = null;
  organisationunitidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
accesslevelOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IUserOrganisationUnit = {} as IUserOrganisationUnit;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private userOrganisationUnitService: UserOrganisationUnitService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.userOrganisationUnit };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AccessLevel: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CanViewChildUnits: new FormControl(false, []),
CanViewParentUnits: new FormControl(false, []),
IsDefault: new FormControl(false, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.organisationunitidOptions.push({Text: 'Role1', Value: '1' });
this.organisationunitidOptions.push({Text: 'Role2', Value: '2' });
this.applicationuseridOptions.push({Text: 'AppUser1', Value: '1' });
this.applicationuseridOptions.push({Text: 'AppUser2', Value: '2' });
this.accesslevelOptions.push({Text: 'Read', Value: 'Read' });
this.accesslevelOptions.push({Text: 'Transact', Value: 'Transact' });
this.accesslevelOptions.push({Text: 'Approve', Value: 'Approve' });
this.accesslevelOptions.push({Text: 'Admin', Value: 'Admin' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.userOrganisationUnitService.getById(this.selectedId).subscribe({
      next: data => {
        this.userOrganisationUnit = data;
        this.objMaster = { ...this.userOrganisationUnit };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IUserOrganisationUnit): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
AccessLevel: obj.AccessLevel || '',
CanViewChildUnits:  obj.CanViewChildUnits || false,
CanViewParentUnits:  obj.CanViewParentUnits || false,
IsDefault:  obj.IsDefault || false,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/userOrganisationUnits/create']);
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
    this.userOrganisationUnit = { ...this.objMaster };
    var obj  = this.userOrganisationUnit;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationUnitId: obj.OrganisationUnitId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
AccessLevel: obj.AccessLevel || '',
CanViewChildUnits:  obj.CanViewChildUnits || false,
CanViewParentUnits:  obj.CanViewParentUnits || false,
IsDefault:  obj.IsDefault || false,
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
     OrganisationUnitId: formValues.OrganisationUnitId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
AccessLevel: formValues.AccessLevel || null,
CanViewChildUnits: formValues.CanViewChildUnits || false,
CanViewParentUnits: formValues.CanViewParentUnits || false,
IsDefault: formValues.IsDefault || false,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IUserOrganisationUnit ; 
	
	  this.spinner.show(); 
    this.userOrganisationUnitService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(UserOrganisationUnit +  'Details Updated sucessfully.');
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



