import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IFinanceApprovalAction } from './financeApprovalAction';
import { FinanceApprovalActionService } from './financeApprovalAction.service';


@Component({
  selector: 'app-financeApprovalAction-edit',
  standalone: false,
  templateUrl: './financeApprovalAction-edit.component.html',
  providers: [ MessageService]
})
export class FinanceApprovalActionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  financeApprovalAction: IFinanceApprovalAction = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeapprovalrequestidOptions: ISelectItem[] = [];
actionbyuseridOptions: ISelectItem[] = [];
actioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IFinanceApprovalAction = {} as IFinanceApprovalAction;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private financeApprovalActionService: FinanceApprovalActionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.financeApprovalAction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
FinanceApprovalRequestId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ActionAtUtc: new FormControl(new Date(), [Validators.required]),
Comments: new FormControl('', [Validators.maxLength(1000), ]), 
AuthoritySnapshot: new FormControl('', [Validators.maxLength(500), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'FinanceApprovalRequestId', 'finance-approval-requests',
      options => this.financeapprovalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ActionByUserId', 'application-users',
      options => this.actionbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.actioncodeOptions = this.loggedInUserService.getPicklistOptions('FinanceApprovalActionActionCode');
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
    this.financeApprovalActionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.financeApprovalAction = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.financeApprovalAction };
        this.populateUI(this.financeApprovalAction);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IFinanceApprovalAction): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FinanceApprovalRequestId: obj.FinanceApprovalRequestId || 0,
ActionByUserId: obj.ActionByUserId || 0,
ActionCode: obj.ActionCode || '',
ActionAtUtc:  obj.ActionAtUtc || new Date(),
Comments: obj.Comments || '',
AuthoritySnapshot: obj.AuthoritySnapshot || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "FinanceApprovalAction Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/control/approval-actions/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.financeApprovalAction = { ...this.objMaster };
	var obj  = this.financeApprovalAction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FinanceApprovalRequestId: obj.FinanceApprovalRequestId || 0,
ActionByUserId: obj.ActionByUserId || 0,
ActionCode: obj.ActionCode || '',
ActionAtUtc:  obj.ActionAtUtc || new Date(),
Comments: obj.Comments || '',
AuthoritySnapshot: obj.AuthoritySnapshot || '',
RecordStatus: obj.RecordStatus || '',
 
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
     FinanceApprovalRequestId:  formValues.FinanceApprovalRequestId || null,
ActionByUserId:  formValues.ActionByUserId || null,
ActionCode:  formValues.ActionCode || null,
ActionAtUtc:  formValues.ActionAtUtc || null,
Comments:  formValues.Comments || null,
AuthoritySnapshot:  formValues.AuthoritySnapshot || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IFinanceApprovalAction ;
	
	this.spinner.show();  	   
    this.financeApprovalActionService.update(this.financeApprovalAction.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(FinanceApprovalAction +  'Details Updated sucessfully.');
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
