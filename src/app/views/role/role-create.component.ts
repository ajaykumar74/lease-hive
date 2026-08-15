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
import { IRole } from './role';
import { RoleService } from './role.service';

@Component({
  selector: 'app-role-create',
  standalone: false,
  templateUrl: './role-create.component.html' ,
   providers: [ MessageService]
})
export class RoleCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  role: IRole = null;
  roletypeOptions: ISelectItem[] = [];
scopetypeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IRole = {} as IRole;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private roleService: RoleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.role };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
RoleType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
IsSystemRole: new FormControl(false, [Validators.required]),
ScopeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.roletypeOptions = this.loggedInUserService.getPicklistOptions('RoleType');
this.scopetypeOptions = this.loggedInUserService.getPicklistOptions('ScopeType');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.roleService.getById(this.selectedId).subscribe({
      next: data => {
        this.role = data;
        this.objMaster = { ...this.role };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IRole): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleCode: obj.RoleCode || '',
RoleName: obj.RoleName || '',
RoleType: obj.RoleType || '',
Description: obj.Description || '',
IsSystemRole:  obj.IsSystemRole || false,
ScopeType: obj.ScopeType || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/roles/create']);
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
    this.role = { ...this.objMaster };
    var obj  = this.role;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleCode: obj.RoleCode || '',
RoleName: obj.RoleName || '',
RoleType: obj.RoleType || '',
Description: obj.Description || '',
IsSystemRole:  obj.IsSystemRole || false,
ScopeType: obj.ScopeType || '',
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
     RoleCode: formValues.RoleCode || null,
RoleName: formValues.RoleName || null,
RoleType: formValues.RoleType || null,
Description: formValues.Description || null,
IsSystemRole: formValues.IsSystemRole || false,
ScopeType: formValues.ScopeType || null,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IRole ; 
	
	  this.spinner.show(); 
    this.roleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Role +  'Details Updated sucessfully.');
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



