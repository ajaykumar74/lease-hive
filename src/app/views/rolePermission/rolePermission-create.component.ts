import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-rolePermission-create',
  standalone: false,
  templateUrl: './rolePermission-create.component.html',
  providers: [MessageService]
})
export class RolePermissionCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Role Permission';
  rolePermission: IRolePermission = null;
  roleidOptions: ISelectItem[] = [];
  permissionidOptions: ISelectItem[] = [];
  granttypeOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IRolePermission = {} as IRolePermission;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private rolePermissionService: RolePermissionService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.rolePermission };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      PermissionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
      GrantType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ConstraintJson: new FormControl('', [Validators.required, Validators.maxLength(2000),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),

    });
this.granttypeOptions = this.loggedInUserService.getPicklistOptions('GrantType');
        this.loggedInUserService.getLookupOptions('permissions').subscribe({
      next: options => this.permissionidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('roles').subscribe({
      next: options => this.roleidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }

  loadUI(): void {
    this.isLoading = true;
    this.rolePermissionService.getById(this.selectedId).subscribe({
      next: data => {
        this.rolePermission = data;
        this.objMaster = { ...this.rolePermission };
        this.populateUI(data);
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
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/rolePermissions/create']);
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
    this.rolePermission = { ...this.objMaster };
    var obj = this.rolePermission;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        RoleId: obj.RoleId || 0,
        PermissionId: obj.PermissionId || 0,
        GrantType: obj.GrantType || '',
        ConstraintJson: obj.ConstraintJson || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

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
    var createdObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      RoleId: formValues.RoleId || 0,
      PermissionId: formValues.PermissionId || 0,
      GrantType: formValues.GrantType || null,
      ConstraintJson: formValues.ConstraintJson || null,
      RecordStatus: 'Active',
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,

    } as IRolePermission;

    this.spinner.show();
    this.rolePermissionService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(RolePermission +  'Details Updated sucessfully.');
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



