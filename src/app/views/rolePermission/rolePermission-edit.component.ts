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
import { IRolePermission } from './rolePermission';
import { RolePermissionService } from './rolePermission.service';


@Component({
  selector: 'app-rolePermission-edit',
  standalone: false,
  templateUrl: './rolePermission-edit.component.html',
  providers: [ MessageService]
})
export class RolePermissionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  rolePermission: IRolePermission = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  roleidOptions: ISelectItem[] = [];
permissionidOptions: ISelectItem[] = [];
granttypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRolePermission = {} as IRolePermission;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private rolePermissionService: RolePermissionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.rolePermission };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PermissionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
GrantType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ConstraintJson: new FormControl('', [Validators.required, Validators.maxLength(2000), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.roleidOptions.push({Text: 'Role1', Value: 'Role1' });
this.roleidOptions.push({Text: 'Role2', Value: 'Role2' });
this.permissionidOptions.push({Text: 'Permission1', Value: 'Permission1' });
this.permissionidOptions.push({Text: 'Pemission2', Value: 'Pemission2' });
this.granttypeOptions.push({Text: 'Allow', Value: 'Allow' });
this.granttypeOptions.push({Text: 'Deny', Value: 'Deny' });
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
    this.rolePermissionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.rolePermission = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.rolePermission };
        this.populateUI(this.rolePermission);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IRolePermission): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleId: obj.RoleId || 0,
PermissionId: obj.PermissionId || 0,
GrantType: obj.GrantType || '',
ConstraintJson: obj.ConstraintJson || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "RolePermission Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/rolePermission/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.rolePermission = { ...this.objMaster };
	var obj  = this.rolePermission;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RoleId: obj.RoleId || 0,
PermissionId: obj.PermissionId || 0,
GrantType: obj.GrantType || '',
ConstraintJson: obj.ConstraintJson || '',
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
PermissionId:  formValues.PermissionId || null,
GrantType:  formValues.GrantType || null,
ConstraintJson:  formValues.ConstraintJson || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IRolePermission ;
	
	this.spinner.show();  	   
    this.rolePermissionService.update(this.rolePermission.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(RolePermission +  'Details Updated sucessfully.');
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
