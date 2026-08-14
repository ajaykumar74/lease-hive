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
import { IUserRole } from './userRole';
import { UserRoleService } from './userRole.service';

@Component({
  selector: 'app-userRole-create',
  standalone: false,
  templateUrl: './userRole-create.component.html' ,
   providers: [ MessageService]
})
export class UserRoleCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  userRole: IUserRole = null;
  roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
scopetypeOptions: ISelectItem[] = [];
assignedbyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IUserRole = {} as IUserRole;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private userRoleService: UserRoleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.userRole };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScopeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ScopeReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedById: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedAt: new FormControl(new Date(), []),
IsDelegated: new FormControl(false, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.loggedInUserService.getApplicationUserOptions().subscribe({
  next: options => this.applicationuseridOptions = options,
  error: err => setTimeout(() => this.messageService?.showError(err))
});
this.scopetypeOptions = this.loggedInUserService.getPicklistOptions('ScopeType');
    this.loggedInUserService.getLookupOptions('application-users').subscribe({
      next: options => this.assignedbyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('roles').subscribe({
      next: options => this.roleidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.userRoleService.getById(this.selectedId).subscribe({
      next: data => {
        this.userRole = data;
        this.objMaster = { ...this.userRole };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IUserRole): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleId: obj.RoleId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
ScopeType: obj.ScopeType || '',
ScopeReferenceId: obj.ScopeReferenceId || 0,
AssignedById: obj.AssignedById || 0,
AssignedAt:  obj.AssignedAt || new Date(),
IsDelegated:  obj.IsDelegated || false,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/userRoles/create']);
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
    this.userRole = { ...this.objMaster };
    var obj  = this.userRole;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleId: obj.RoleId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
ScopeType: obj.ScopeType || '',
ScopeReferenceId: obj.ScopeReferenceId || 0,
AssignedById: obj.AssignedById || 0,
AssignedAt:  obj.AssignedAt || new Date(),
IsDelegated:  obj.IsDelegated || false,
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
     RoleId: formValues.RoleId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
ScopeType: formValues.ScopeType || null,
ScopeReferenceId: formValues.ScopeReferenceId || 0,
AssignedById: formValues.AssignedById || 0,
AssignedAt: formValues.AssignedAt || null,
IsDelegated: formValues.IsDelegated || false,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IUserRole ; 
	
	  this.spinner.show(); 
    this.userRoleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(UserRole +  'Details Updated sucessfully.');
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



