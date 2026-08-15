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
import { IApprovalAuthority } from './approvalAuthority';
import { ApprovalAuthorityService } from './approvalAuthority.service';

@Component({
  selector: 'app-approvalAuthority-create',
  standalone: false,
  templateUrl: './approvalAuthority-create.component.html' ,
   providers: [ MessageService]
})
export class ApprovalAuthorityCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  approvalAuthority: IApprovalAuthority = null;
  authoritytypeOptions: ISelectItem[] = [];
roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IApprovalAuthority = {} as IApprovalAuthority;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private approvalAuthorityService: ApprovalAuthorityService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.approvalAuthority };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ProcessCode: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovalLevel: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
AuthorityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MinimumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaximumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiredApproverCount: new FormControl(0, [Validators.min(0), Validators.max(255)]),
CanDelegate: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.authoritytypeOptions = this.loggedInUserService.getPicklistOptions('AuthorityType');
this.loggedInUserService.getApplicationUserOptions().subscribe({
  next: options => this.applicationuseridOptions = options,
  error: err => setTimeout(() => this.messageService?.showError(err))
});
    this.loggedInUserService.getLookupOptions('organisation-units').subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('roles').subscribe({
      next: options => this.roleidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.approvalAuthorityService.getById(this.selectedId).subscribe({
      next: data => {
        this.approvalAuthority = data;
        this.objMaster = { ...this.approvalAuthority };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IApprovalAuthority): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ProcessCode: obj.ProcessCode || 0,
ApprovalLevel: obj.ApprovalLevel || 0,
AuthorityType: obj.AuthorityType || '',
RoleId: obj.RoleId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
MinimumAmount: obj.MinimumAmount || 0,
MaximumAmount: obj.MaximumAmount || 0,
RequiredApproverCount: obj.RequiredApproverCount || 0,
CanDelegate:  obj.CanDelegate || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/approvalAuthoritys/create']);
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
    this.approvalAuthority = { ...this.objMaster };
    var obj  = this.approvalAuthority;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ProcessCode: obj.ProcessCode || 0,
ApprovalLevel: obj.ApprovalLevel || 0,
AuthorityType: obj.AuthorityType || '',
RoleId: obj.RoleId || 0,
ApplicationUserId: obj.ApplicationUserId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
MinimumAmount: obj.MinimumAmount || 0,
MaximumAmount: obj.MaximumAmount || 0,
RequiredApproverCount: obj.RequiredApproverCount || 0,
CanDelegate:  obj.CanDelegate || false,
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
     ProcessCode: formValues.ProcessCode || 0,
ApprovalLevel: formValues.ApprovalLevel || null,
AuthorityType: formValues.AuthorityType || null,
RoleId: formValues.RoleId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
OrganisationUnitId: formValues.OrganisationUnitId || 0,
MinimumAmount: formValues.MinimumAmount || 0,
MaximumAmount: formValues.MaximumAmount || 0,
RequiredApproverCount: formValues.RequiredApproverCount || null,
CanDelegate: formValues.CanDelegate || false,
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IApprovalAuthority ; 
	
	  this.spinner.show(); 
    this.approvalAuthorityService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ApprovalAuthority +  'Details Updated sucessfully.');
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



