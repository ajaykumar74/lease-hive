import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-permission-edit',
  standalone: false,
  templateUrl: './permission-edit.component.html',
  providers: [MessageService]
})
export class PermissionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  apppermission: IAppPermission = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  modulecodeOptions: ISelectItem[] = [];
  resourcetypeOptions: ISelectItem[] = [];
  actionnameOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IAppPermission = {} as IAppPermission;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private permissionService: PermissionService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.objMaster = { ...this.apppermission };

    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]),
      PermissionCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ResourceType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      ResourceName: new FormControl('', [Validators.required, Validators.maxLength(30),]),
      ActionName: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      IsSensitive: new FormControl(false),
      RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), []),

    });
this.modulecodeOptions = this.loggedInUserService.getPicklistOptions('ModuleCode');
this.resourcetypeOptions = this.loggedInUserService.getPicklistOptions('ResourceType');
this.actionnameOptions = this.loggedInUserService.getPicklistOptions('ActionName');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.permissionService.getById(this.selectedId).subscribe({
      next: data => {
        this.permission = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.apppermission };
        this.populateUI(this.apppermission);
      },
      error: err => { this.messageService.showSuccess(err); },
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
        IsSensitive: obj.IsSensitive || false,
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

      }
    );

    this.Caption = "Permission Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/permission/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.apppermission = { ...this.objMaster };
    var obj = this.apppermission;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        PermissionCode: obj.PermissionCode || '',
        ModuleCode: obj.ModuleCode || '',
        ResourceType: obj.ResourceType || '',
        ResourceName: obj.ResourceName || '',
        ActionName: obj.ActionName || '',
        Description: obj.Description || '',
        IsSensitive: obj.IsSensitive || false,
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date()
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
      RowVersionStr: this.objMaster.RowVersionStr,
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

    } as IAppPermission;

    this.spinner.show();
    this.permissionService.update(this.apppermission.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Permission +  'Details Updated sucessfully.');
        //this.editForm.reset();
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
