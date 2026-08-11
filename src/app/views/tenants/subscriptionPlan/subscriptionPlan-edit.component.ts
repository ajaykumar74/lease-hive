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
import { ISubscriptionPlan } from './subscriptionPlan';
import { SubscriptionPlanService } from './subscriptionPlan.service';


@Component({
  selector: 'app-subscriptionPlan-edit',
  standalone: false,
  templateUrl: './subscriptionPlan-edit.component.html',
  providers: [ MessageService]
})
export class SubscriptionPlanEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  subscriptionPlan: ISubscriptionPlan = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  
   editForm: any; 
  objMaster : ISubscriptionPlan = {} as ISubscriptionPlan;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private subscriptionPlanService: SubscriptionPlanService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.subscriptionPlan };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PlanCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PlanName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
MaxUsers: new FormControl(0, [Validators.required]),
MaxAssets: new FormControl(0, []),
StorageGB: new FormControl(0, []),
Description: new FormControl('', [Validators.maxLength(256), ]), 

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
    this.subscriptionPlanService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.subscriptionPlan = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.subscriptionPlan };
        this.populateUI(this.subscriptionPlan);
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
   
	 this.Caption = "SubscriptionPlan Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/subscriptionPlan/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.subscriptionPlan = { ...this.objMaster };
	var obj  = this.subscriptionPlan;
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
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PlanCode:  formValues.PlanCode || null,
PlanName:  formValues.PlanName || null,
MaxUsers:  formValues.MaxUsers || null,
MaxAssets:  formValues.MaxAssets || null,
StorageGB:  formValues.StorageGB || null,
Description:  formValues.Description || null,

    } as ISubscriptionPlan ;
	
	this.spinner.show();  	   
    this.subscriptionPlanService.update(this.subscriptionPlan.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SubscriptionPlan +  'Details Updated sucessfully.');
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
