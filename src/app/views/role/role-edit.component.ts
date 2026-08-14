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
import { IRole } from './role';
import { RoleService } from './role.service';


@Component({
  selector: 'app-role-edit',
  standalone: false,
  templateUrl: './role-edit.component.html',
  providers: [ MessageService]
})
export class RoleEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  role: IRole = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  roletypeOptions: ISelectItem[] = [];
scopetypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRole = {} as IRole;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private roleService: RoleService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.role };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
RoleType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
IsSystemRole: new FormControl(false, [Validators.required]),
ScopeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.roletypeOptions.push({Text: 'System', Value: 'System' });
this.roletypeOptions.push({Text: 'InternalBusiness', Value: 'InternalBusiness' });
this.roletypeOptions.push({Text: 'CustomerPortal', Value: 'CustomerPortal' });
this.roletypeOptions.push({Text: 'SupplierPortal', Value: 'SupplierPortal' });
this.roletypeOptions.push({Text: 'Custom', Value: 'Custom' });
this.scopetypeOptions.push({Text: 'Tenant', Value: 'Tenant' });
this.scopetypeOptions.push({Text: 'Organisation', Value: 'Organisation' });
this.scopetypeOptions.push({Text: 'OrganisationUnit', Value: 'OrganisationUnit' });
this.scopetypeOptions.push({Text: 'Party', Value: 'Party' });
this.scopetypeOptions.push({Text: 'Self', Value: 'Self' });
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
    this.roleService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.role = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.role };
        this.populateUI(this.role);
      },
      error: err => { this.messageService.showSuccess(err); },
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "Role Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/role/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
     RoleCode:  formValues.RoleCode || null,
RoleName:  formValues.RoleName || null,
RoleType:  formValues.RoleType || null,
Description:  formValues.Description || null,
IsSystemRole:  formValues.IsSystemRole || null,
ScopeType:  formValues.ScopeType || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IRole ;
	
	this.spinner.show();  	   
    this.roleService.update(this.role.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Role +  'Details Updated sucessfully.');
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
