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
import { ISubscriptionPlan } from './subscriptionPlan';
import { SubscriptionPlanService } from './subscriptionPlan.service';

@Component({
  selector: 'app-subscriptionPlan-create',
  standalone: false,
  templateUrl: './subscriptionPlan-create.component.html',
  providers: [MessageService]
})
export class SubscriptionPlanCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Subscription Plan';
  subscriptionPlan: ISubscriptionPlan = null;

  editForm: any;
  objMaster: ISubscriptionPlan = {} as ISubscriptionPlan;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private subscriptionPlanService: SubscriptionPlanService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.subscriptionPlan };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      PlanCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      PlanName: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      MaxUsers: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
      MaxAssets: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
      StorageGB: new FormControl(0, [Validators.min(0), Validators.max(255)]),
      Description: new FormControl('', [Validators.maxLength(256),]),

    });

  }

  loadUI(): void {
    this.isLoading = true;
    this.subscriptionPlanService.getById(this.selectedId).subscribe({
      next: data => {
        this.subscriptionPlan = data;
        this.objMaster = { ...this.subscriptionPlan };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: ISubscriptionPlan): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        PlanCode: obj.PlanCode || '',
        PlanName: obj.PlanName || '',
        MaxUsers: obj.MaxUsers || 0,
        MaxAssets: obj.MaxAssets || 0,
        StorageGB: obj.StorageGB || 0,
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/subscriptionPlans/create']);
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
    this.subscriptionPlan = { ...this.objMaster };
    var obj = this.subscriptionPlan;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        PlanCode: obj.PlanCode || '',
        PlanName: obj.PlanName || '',
        MaxUsers: obj.MaxUsers || 0,
        MaxAssets: obj.MaxAssets || 0,
        StorageGB: obj.StorageGB || 0,
        Description: obj.Description || '',

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
      PlanCode: formValues.PlanCode || null,
      PlanName: formValues.PlanName || null,
      MaxUsers: formValues.MaxUsers || 0,
      MaxAssets: formValues.MaxAssets || 0,
      StorageGB: formValues.StorageGB || 0,
      Description: formValues.Description || null,

    } as ISubscriptionPlan;

    this.spinner.show();
    this.subscriptionPlanService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(SubscriptionPlan +  'Details Updated sucessfully.');
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



