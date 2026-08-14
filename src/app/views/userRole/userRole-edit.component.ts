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
import { IUserRole } from './userRole';
import { UserRoleService } from './userRole.service';


@Component({
  selector: 'app-userRole-edit',
  standalone: false,
  templateUrl: './userRole-edit.component.html',
  providers: [ MessageService]
})
export class UserRoleEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  userRole: IUserRole = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
scopetypeOptions: ISelectItem[] = [];
assignedbyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IUserRole = {} as IUserRole;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private userRoleService: UserRoleService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.userRole };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScopeType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ScopeReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedById: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedAt: new FormControl(new Date(), []),
IsDelegated: new FormControl(false), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.roleidOptions.push({Text: 'Role1', Value: 'Role1' });
this.roleidOptions.push({Text: 'Role2', Value: 'Role2' });
this.applicationuseridOptions.push({Text: 'AppUser1', Value: 'AppUser1' });
this.applicationuseridOptions.push({Text: 'AppUser2', Value: 'AppUser2' });
this.scopetypeOptions.push({Text: 'Tenant', Value: 'Tenant' });
this.scopetypeOptions.push({Text: 'Organisation', Value: 'Organisation' });
this.scopetypeOptions.push({Text: 'OrganisationUnit', Value: 'OrganisationUnit' });
this.scopetypeOptions.push({Text: 'Party', Value: 'Party' });
this.scopetypeOptions.push({Text: 'Self', Value: 'Self' });
this.assignedbyidOptions.push({Text: 'User1', Value: 'User1' });
this.assignedbyidOptions.push({Text: 'User2', Value: 'User2' });
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
    this.userRoleService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.userRole = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.userRole };
        this.populateUI(this.userRole);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "UserRole Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/userRole/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     RoleId:  formValues.RoleId || null,
ApplicationUserId:  formValues.ApplicationUserId || null,
ScopeType:  formValues.ScopeType || null,
ScopeReferenceId:  formValues.ScopeReferenceId || null,
AssignedById:  formValues.AssignedById || null,
AssignedAt:  formValues.AssignedAt || null,
IsDelegated:  formValues.IsDelegated || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IUserRole ;
	
	this.spinner.show();  	   
    this.userRoleService.update(this.userRole.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(UserRole +  'Details Updated sucessfully.');
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
