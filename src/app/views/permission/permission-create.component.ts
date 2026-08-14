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
import { IAppPermission } from './appPermission';
import { PermissionService } from './permission.service';

@Component({
  selector: 'app-permission-create',
  standalone: false,
  templateUrl: './permission-create.component.html' ,
   providers: [ MessageService]
})
export class PermissionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  apppermission = {} as IAppPermission;
  Caption: string = 'Loading...';
  permission: IPermission = null;
  modulecodeOptions: ISelectItem[] = [];
resourcetypeOptions: ISelectItem[] = [];
actionnameOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAppPermission = {} as IAppPermission;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private permissionService: PermissionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.apppermission };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PermissionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResourceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResourceName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ActionName: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
IsSensitive: new FormControl(false, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.modulecodeOptions = this.loggedInUserService.getPicklistOptions('ModuleCode');
this.resourcetypeOptions = this.loggedInUserService.getPicklistOptions('ResourceType');
this.actionnameOptions = this.loggedInUserService.getPicklistOptions('ActionName');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.permissionService.getById(this.selectedId).subscribe({
      next: data => {
        this.permission = data;
        this.objMaster = { ...this.apppermission };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAppPermission): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PermissionCode: obj.PermissionCode || '',
ModuleCode: obj.ModuleCode || '',
ResourceType: obj.ResourceType || '',
ResourceName: obj.ResourceName || '',
ActionName: obj.ActionName || '',
Description: obj.Description || '',
IsSensitive:  obj.IsSensitive || false,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/permissions/create']);
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
    this.apppermission = { ...this.objMaster };
    var obj  = this.apppermission;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PermissionCode: obj.PermissionCode || '',
ModuleCode: obj.ModuleCode || '',
ResourceType: obj.ResourceType || '',
ResourceName: obj.ResourceName || '',
ActionName: obj.ActionName || '',
Description: obj.Description || '',
IsSensitive:  obj.IsSensitive || false,
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
     PermissionCode: formValues.PermissionCode || null,
ModuleCode: formValues.ModuleCode || null,
ResourceType: formValues.ResourceType || null,
ResourceName: formValues.ResourceName || null,
ActionName: formValues.ActionName || null,
Description: formValues.Description || null,
IsSensitive: formValues.IsSensitive || false,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IAppPermission ; 
	
	  this.spinner.show(); 
    this.permissionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Permission +  'Details Updated sucessfully.');
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



