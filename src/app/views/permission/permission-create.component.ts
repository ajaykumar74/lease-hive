import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAccessPermissionResource, IAppPermission } from './appPermission';
import { PermissionService } from './permission.service';

@Component({
  selector: 'app-permission-create',
  standalone: false,
  templateUrl: './permission-create.component.html' ,
   providers: [ MessageService]
})
export class PermissionCreateComponent implements OnInit, OnDestroy {

   
  selectedId: number; 
  isLoading : boolean = false;
  apppermission = {} as IAppPermission;
  Caption: string = 'Create Permission';
  permission: IPermission = null;
  modulecodeOptions: ISelectItem[] = [];
resourcetypeOptions: ISelectItem[] = [];
actionnameOptions: ISelectItem[] = [];
  resourceNameOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAppPermission = {} as IAppPermission;
  private readonly destroy$ = new Subject<void>();
  
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
PermissionCode: new FormControl('', [Validators.maxLength(50), ]),
ModuleCode: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
ResourceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ResourceName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ResourceKey: new FormControl('', []),
ActionName: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
IsSensitive: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.modulecodeOptions = this.loggedInUserService.getPicklistOptions('ModuleCode');
this.resourcetypeOptions = this.loggedInUserService.getPicklistOptions('ResourceType');
this.actionnameOptions = this.loggedInUserService.getPicklistOptions('PermissionAction');

    this.permissionService.getAccessPermissionResources()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: resources => this.setResourceNameOptions(resources),
        error: err => this.messageService.showError(err)
      });

    merge(
      this.editForm.get('ModuleCode').valueChanges,
      this.editForm.get('ResourceName').valueChanges,
      this.editForm.get('ActionName').valueChanges
    ).pipe(takeUntil(this.destroy$)).subscribe(() => this.updatePermissionCode());

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePermissionCode(): void {
    const values = [
      this.editForm.get('ModuleCode')?.value,
      this.editForm.get('ResourceName')?.value,
      this.editForm.get('ActionName')?.value
    ].map(value => String(value ?? '').trim());

    this.editForm.get('PermissionCode')?.setValue(
      values.every(Boolean) ? values.join('.') : '',
      { emitEvent: false }
    );
  }

  onResourceSelected(resourceKey: string): void {
    const resource = this.accessPermissionResources.find(
      item => this.getResourceKey(item.ModuleCode, item.ResourceName) === resourceKey
    );
    if (!resource) {
      return;
    }

    this.editForm.patchValue(
      {
        ModuleCode: this.getModuleCodeValue(resource.ModuleCode),
        ResourceName: resource.ResourceName,
        ResourceType: this.editForm.get('ResourceType')?.value || this.getEntityResourceType()
      },
      { emitEvent: false }
    );
    this.updatePermissionCode();
  }

  private accessPermissionResources: IAccessPermissionResource[] = [];

  private setResourceNameOptions(resources: IAccessPermissionResource[]): void {
    this.accessPermissionResources = resources ?? [];
    this.resourceNameOptions = this.accessPermissionResources.map(resource => ({
      Text: `${resource.DisplayName} (${resource.ModuleCode})`,
      Value: this.getResourceKey(resource.ModuleCode, resource.ResourceName)
    }));
  }

  private getResourceKey(moduleCode: string, resourceName: string): string {
    return `${String(moduleCode ?? '').trim().toLowerCase()}|${String(resourceName ?? '').trim().toLowerCase()}`;
  }

  private getModuleCodeValue(moduleCode: string): string {
    return this.modulecodeOptions.find(
      option => option.Value.toLowerCase() === moduleCode.toLowerCase()
    )?.Value ?? moduleCode;
  }

  private getEntityResourceType(): string {
    return this.resourcetypeOptions.find(
      option => option.Value.toLowerCase() === 'entity'
    )?.Value ?? 'Entity';
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
ResourceKey: this.getResourceKey(obj.ModuleCode, obj.ResourceName),
ActionName: obj.ActionName || '',
Description: obj.Description || '',
IsSensitive:  obj.IsSensitive || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/permissions/create']);
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
ResourceKey: this.getResourceKey(obj.ModuleCode, obj.ResourceName),
ActionName: obj.ActionName || '',
Description: obj.Description || '',
IsSensitive:  obj.IsSensitive || false,
 
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
RecordStatus: 'Active',
EffectiveFrom: new Date(),
EffectiveTo: null,

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



