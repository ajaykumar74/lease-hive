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
import { IUserDelegation } from './userDelegation';
import { UserDelegationService } from './userDelegation.service';


@Component({
  selector: 'app-userDelegation-edit',
  standalone: false,
  templateUrl: './userDelegation-edit.component.html',
  providers: [ MessageService]
})
export class UserDelegationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  userDelegation: IUserDelegation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  delegatoruseridOptions: ISelectItem[] = [];
delegateuseridOptions: ISelectItem[] = [];
delegationtypeOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
approvedbyidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IUserDelegation = {} as IUserDelegation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private userDelegationService: UserDelegationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.userDelegation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
UserDelegationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DelegatorUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DelegateUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DelegationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProcessCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StartDateTime: new FormControl(new Date(), []),
EndDateTime: new FormControl(new Date(), []),
Reason: new FormControl('', [Validators.maxLength(100), ]), 
ApprovedById: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.delegationtypeOptions = this.loggedInUserService.getPicklistOptions('DelegationType');
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
    this.userDelegationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.userDelegation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.userDelegation };
        this.populateUI(this.userDelegation);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IUserDelegation): void {
    this.loggedInUserService.getLookupOptions('application-users', obj.ApprovedById).subscribe({
      next: options => this.approvedbyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('application-users', obj.DelegateUserId).subscribe({
      next: options => this.delegateuseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('application-users', obj.DelegatorUserId).subscribe({
      next: options => this.delegatoruseridOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  UserDelegationId: obj.UserDelegationId || 0,
DelegatorUserId: obj.DelegatorUserId || 0,
DelegateUserId: obj.DelegateUserId || 0,
DelegationType: obj.DelegationType || '',
ProcessCode: obj.ProcessCode || '',
OrganisationUnitId: obj.OrganisationUnitId || 0,
StartDateTime:  obj.StartDateTime || new Date(),
EndDateTime:  obj.EndDateTime || new Date(),
Reason: obj.Reason || '',
ApprovedById: obj.ApprovedById || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "UserDelegation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/userDelegation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.userDelegation = { ...this.objMaster };
	var obj  = this.userDelegation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  UserDelegationId: obj.UserDelegationId || 0,
DelegatorUserId: obj.DelegatorUserId || 0,
DelegateUserId: obj.DelegateUserId || 0,
DelegationType: obj.DelegationType || '',
ProcessCode: obj.ProcessCode || '',
OrganisationUnitId: obj.OrganisationUnitId || 0,
StartDateTime:  obj.StartDateTime || new Date(),
EndDateTime:  obj.EndDateTime || new Date(),
Reason: obj.Reason || '',
ApprovedById: obj.ApprovedById || 0,
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
     UserDelegationId:  formValues.UserDelegationId || null,
DelegatorUserId:  formValues.DelegatorUserId || null,
DelegateUserId:  formValues.DelegateUserId || null,
DelegationType:  formValues.DelegationType || null,
ProcessCode:  formValues.ProcessCode || null,
OrganisationUnitId:  formValues.OrganisationUnitId || null,
StartDateTime:  formValues.StartDateTime || null,
EndDateTime:  formValues.EndDateTime || null,
Reason:  formValues.Reason || null,
ApprovedById:  formValues.ApprovedById || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IUserDelegation ;
	
	this.spinner.show();  	   
    this.userDelegationService.update(this.userDelegation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(UserDelegation +  'Details Updated sucessfully.');
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
