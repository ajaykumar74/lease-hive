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
import { IApprovalAuthority } from './approvalAuthority';
import { ApprovalAuthorityService } from './approvalAuthority.service';


@Component({
  selector: 'app-approvalAuthority-edit',
  standalone: false,
  templateUrl: './approvalAuthority-edit.component.html',
  providers: [ MessageService]
})
export class ApprovalAuthorityEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  approvalAuthority: IApprovalAuthority = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  authoritytypeOptions: ISelectItem[] = [];
processcodeOptions: ISelectItem[] = [];
roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];
showRoleIdDropdown: boolean = false;
showApplicationUserIdDropdown: boolean = false;

   editForm: any; 
  objMaster : IApprovalAuthority = {} as IApprovalAuthority;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private approvalAuthorityService: ApprovalAuthorityService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.approvalAuthority };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ProcessCode: new FormControl('', [Validators.required, Validators.maxLength(50)]),
ApprovalLevel: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
AuthorityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleId: new FormControl(null),
ApplicationUserId: new FormControl(null),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MinimumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaximumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiredApproverCount: new FormControl(0, [Validators.min(0), Validators.max(255)]),
CanDelegate: new FormControl(false), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.authoritytypeOptions = this.loggedInUserService.getPicklistOptions('AuthorityType');
this.processcodeOptions = this.loggedInUserService.getPicklistOptions('ApprovalProcessCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');
    this.editForm.get('AuthorityType').valueChanges.subscribe((authorityType: string) => {
      this.configureAuthorityTarget(authorityType, true);
    });
    this.configureAuthorityTarget(this.editForm.get('AuthorityType').value);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.approvalAuthorityService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.approvalAuthority = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.approvalAuthority };
        this.populateUI(this.approvalAuthority);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IApprovalAuthority): void {
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    if ((obj.AuthorityType || '').trim().toLowerCase() === 'role') {
      this.loggedInUserService.getLookupOptions('roles', obj.RoleId).subscribe({
        next: options => this.roleidOptions = options,
        error: err => setTimeout(() => this.messageService?.showError(err))
      });
    }
    if ((obj.AuthorityType || '').trim().toLowerCase() === 'user') {
      this.loggedInUserService.getApplicationUserOptions(obj.ApplicationUserId).subscribe({
        next: options => this.applicationuseridOptions = options,
        error: err => this.messageService?.showError(err)
      });
    }
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      },
      { emitEvent: false }
    );
    this.configureAuthorityTarget(obj.AuthorityType);
   
	 this.Caption = "ApprovalAuthority Details #" + obj.Id;
  }

  private configureAuthorityTarget(authorityType: string, clearSelection = false): void {
    const normalizedAuthorityType = (authorityType || '').trim().toLowerCase();
    const roleControl = this.editForm.get('RoleId');
    const applicationUserControl = this.editForm.get('ApplicationUserId');

    this.showRoleIdDropdown = normalizedAuthorityType === 'role';
    this.showApplicationUserIdDropdown = normalizedAuthorityType === 'user';

    if (clearSelection && this.showRoleIdDropdown) {
      this.loggedInUserService.getLookupOptions('roles').subscribe({
        next: options => this.roleidOptions = options,
        error: err => this.messageService?.showError(err)
      });
    }

    if (clearSelection && this.showApplicationUserIdDropdown) {
      this.loggedInUserService.getApplicationUserOptions().subscribe({
        next: options => this.applicationuseridOptions = options,
        error: err => this.messageService?.showError(err)
      });
    }

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
      this.router.navigate(['/approvalAuthority/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
	
     const formValues = this.editForm.getRawValue();
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ProcessCode:  formValues.ProcessCode || null,
ApprovalLevel:  formValues.ApprovalLevel || 0,
AuthorityType:  formValues.AuthorityType || null,
RoleId:  formValues.RoleId || 0,
ApplicationUserId:  formValues.ApplicationUserId || 0,
OrganisationUnitId:  formValues.OrganisationUnitId || 0,
MinimumAmount:  formValues.MinimumAmount || 0,
MaximumAmount:  formValues.MaximumAmount || 0,
RequiredApproverCount:  formValues.RequiredApproverCount || 0,
CanDelegate:  formValues.CanDelegate || false,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IApprovalAuthority ;
	
	this.spinner.show();  	   
    this.approvalAuthorityService.update(this.approvalAuthority.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ApprovalAuthority +  'Details Updated sucessfully.');
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
