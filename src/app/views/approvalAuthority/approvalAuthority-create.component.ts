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
  Caption: string = 'Create Approval Authority';
  approvalAuthority: IApprovalAuthority = null;
  authoritytypeOptions: ISelectItem[] = [];
processcodeOptions: ISelectItem[] = [];
roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
showRoleIdDropdown: boolean = false;
showApplicationUserIdDropdown: boolean = false;

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
ProcessCode: new FormControl('', [Validators.required, Validators.maxLength(50)]),
ApprovalLevel: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
AuthorityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleId: new FormControl(null),
ApplicationUserId: new FormControl(null),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MinimumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaximumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiredApproverCount: new FormControl(0, [Validators.min(0), Validators.max(255)]),
CanDelegate: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.authoritytypeOptions = this.loggedInUserService.getPicklistOptions('AuthorityType');
this.processcodeOptions = this.loggedInUserService.getPicklistOptions('ApprovalProcessCode');
    this.editForm.get('AuthorityType').valueChanges.subscribe((authorityType: string) => {
      this.configureAuthorityTarget(authorityType, true);
    });
    this.configureAuthorityTarget(this.editForm.get('AuthorityType').value);
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
	  ProcessCode: obj.ProcessCode || '',
ApprovalLevel: obj.ApprovalLevel || 0,
AuthorityType: obj.AuthorityType || '',
RoleId: obj.RoleId || null,
ApplicationUserId: obj.ApplicationUserId || null,
OrganisationUnitId: obj.OrganisationUnitId || 0,
MinimumAmount: obj.MinimumAmount || 0,
MaximumAmount: obj.MaximumAmount || 0,
RequiredApproverCount: obj.RequiredApproverCount || 0,
CanDelegate:  obj.CanDelegate || false,
 
      },
      { emitEvent: false }
    );
    this.configureAuthorityTarget(obj.AuthorityType);
  }

  private configureAuthorityTarget(authorityType: string, clearSelection = false): void {
    const normalizedAuthorityType = (authorityType || '').trim().toLowerCase();
    const roleControl = this.editForm.get('RoleId');
    const applicationUserControl = this.editForm.get('ApplicationUserId');

    this.showRoleIdDropdown = normalizedAuthorityType === 'role';
    this.showApplicationUserIdDropdown = normalizedAuthorityType === 'user';

    roleControl.clearValidators();
    applicationUserControl.clearValidators();

    if (this.showRoleIdDropdown) {
      roleControl.enable({ emitEvent: false });
      roleControl.setValidators([Validators.required]);
      applicationUserControl.setValue(null, { emitEvent: false });
      applicationUserControl.disable({ emitEvent: false });
    } else if (this.showApplicationUserIdDropdown) {
      applicationUserControl.enable({ emitEvent: false });
      applicationUserControl.setValidators([Validators.required]);
      roleControl.setValue(null, { emitEvent: false });
      roleControl.disable({ emitEvent: false });
    } else {
      roleControl.setValue(null, { emitEvent: false });
      applicationUserControl.setValue(null, { emitEvent: false });
      roleControl.disable({ emitEvent: false });
      applicationUserControl.disable({ emitEvent: false });
    }

    if (clearSelection) {
      if (this.showRoleIdDropdown) {
        roleControl.setValue(null, { emitEvent: false });
      } else if (this.showApplicationUserIdDropdown) {
        applicationUserControl.setValue(null, { emitEvent: false });
      }
    }

    roleControl.updateValueAndValidity({ emitEvent: false });
    applicationUserControl.updateValueAndValidity({ emitEvent: false });
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
	  ProcessCode: obj.ProcessCode || '',
ApprovalLevel: obj.ApprovalLevel || 0,
AuthorityType: obj.AuthorityType || '',
RoleId: obj.RoleId || null,
ApplicationUserId: obj.ApplicationUserId || null,
OrganisationUnitId: obj.OrganisationUnitId || 0,
MinimumAmount: obj.MinimumAmount || 0,
MaximumAmount: obj.MaximumAmount || 0,
RequiredApproverCount: obj.RequiredApproverCount || 0,
CanDelegate:  obj.CanDelegate || false,
 
      },
      { emitEvent: false }
    );
    this.configureAuthorityTarget(obj.AuthorityType);
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.getRawValue();
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ProcessCode: formValues.ProcessCode || null,
ApprovalLevel: formValues.ApprovalLevel || 0,
AuthorityType: formValues.AuthorityType || null,
RoleId: formValues.RoleId || 0,
ApplicationUserId: formValues.ApplicationUserId || 0,
OrganisationUnitId: formValues.OrganisationUnitId || 0,
MinimumAmount: formValues.MinimumAmount || 0,
MaximumAmount: formValues.MaximumAmount || 0,
RequiredApproverCount: formValues.RequiredApproverCount || 0,
CanDelegate: formValues.CanDelegate || false,
RecordStatus: 'Active',
EffectiveFrom: new Date(),
EffectiveTo: null,

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



