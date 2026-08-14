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
roleidOptions: ISelectItem[] = [];
applicationuseridOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

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
ProcessCode: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApprovalLevel: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
AuthorityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RoleId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MinimumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaximumAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequiredApproverCount: new FormControl(0, [Validators.min(0), Validators.max(255)]),
CanDelegate: new FormControl(false), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.authoritytypeOptions.push({Text: 'Role', Value: 'Role' });
this.authoritytypeOptions.push({Text: 'User', Value: 'User' });
this.roleidOptions.push({Text: 'Role1', Value: 'Role1' });
this.roleidOptions.push({Text: 'Role2', Value: 'Role2' });
this.applicationuseridOptions.push({Text: 'AppUser1', Value: 'AppUser1' });
this.applicationuseridOptions.push({Text: 'AppUser2', Value: 'AppUser2' });
this.organisationunitidOptions.push({Text: 'Org1', Value: 'Org1' });
this.organisationunitidOptions.push({Text: 'Org2', Value: 'Org2' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

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
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "ApprovalAuthority Details #" + obj.Id;
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ProcessCode:  formValues.ProcessCode || null,
ApprovalLevel:  formValues.ApprovalLevel || null,
AuthorityType:  formValues.AuthorityType || null,
RoleId:  formValues.RoleId || null,
ApplicationUserId:  formValues.ApplicationUserId || null,
OrganisationUnitId:  formValues.OrganisationUnitId || null,
MinimumAmount:  formValues.MinimumAmount || null,
MaximumAmount:  formValues.MaximumAmount || null,
RequiredApproverCount:  formValues.RequiredApproverCount || null,
CanDelegate:  formValues.CanDelegate || null,
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
