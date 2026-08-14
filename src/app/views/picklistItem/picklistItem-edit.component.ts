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
import { IPicklistItem } from './picklistItem';
import { PicklistItemService } from './picklistItem.service';


@Component({
  selector: 'app-picklistItem-edit',
  standalone: false,
  templateUrl: './picklistItem-edit.component.html',
  providers: [MessageService]
})
export class PicklistItemEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  picklistItem: IPicklistItem = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';

  editForm: any;
  objMaster: IPicklistItem = {} as IPicklistItem;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private picklistItemService: PicklistItemService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;




  ngOnInit(): void {
    this.objMaster = { ...this.picklistItem };
    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Category: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      ItemName: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      IsSystem: new FormControl(false, []),
      TenantId: new FormControl(null, [])
    });


    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.picklistItemService.getById(this.selectedId).subscribe({
      next: data => {
        this.picklistItem = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.picklistItem };
        this.populateUI(this.picklistItem);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IPicklistItem): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Category: obj.Category || '',
        ItemName: obj.ItemName || '',
        Description: obj.Description || '',
        IsSystem: obj.IsSystem || false,
        TenantId: obj.TenantId || 0,

      }
    );

    this.Caption = "PicklistItem Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/picklistItem/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.editForm.reset();
    this.picklistItem = { ...this.objMaster };
    this.populateUI(this.picklistItem);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
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
      Category: formValues.Category || null,
      ItemName: formValues.ItemName || null,
      Description: formValues.Description || null,
      IsSystem: formValues.IsSystem || false,
      TenantId: formValues.TenantId || this.loggedInUserService.loggedInUser.Tenant.Id,
      ModifiedById: this.loggedInUserService.getRecordId,

    } as IPicklistItem;

    this.spinner.show();
    this.picklistItemService.update(this.picklistItem.Id, updatedObj).subscribe({
      next: data => {
        this.picklistItemService.CacheData.IsLoaded = false;
        this.loggedInUserService.refreshPicklistCache().subscribe({
          next: () => this._location.back(),
          error: err => this.messageService.showError(err)
        });
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }
}
