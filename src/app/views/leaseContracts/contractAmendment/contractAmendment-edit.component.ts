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
import { IContractAmendment } from './contractAmendment';
import { ContractAmendmentService } from './contractAmendment.service';


@Component({
  selector: 'app-contractAmendment-edit',
  standalone: false,
  templateUrl: './contractAmendment-edit.component.html',
  providers: [ MessageService]
})
export class ContractAmendmentEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  contractAmendment: IContractAmendment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
amendmenttypecodeOptions: ISelectItem[] = [];
amendmentstatuscodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractAmendment = {} as IContractAmendment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractAmendmentService: ContractAmendmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractAmendment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AmendmentNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
FromVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ToVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
AmendmentTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedDate: new FormControl(new Date(), [Validators.required]),
EffectiveDate: new FormControl(new Date(), []),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AmendmentStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExecutedOn: new FormControl(new Date(), []),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.amendmenttypecodeOptions = this.loggedInUserService.getPicklistOptions('AmendmentTypeCode');
this.amendmentstatuscodeOptions = this.loggedInUserService.getPicklistOptions('AmendmentStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ApprovalRequestId', 'approval-requests',
      options => this.approvalrequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractAmendmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractAmendment = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractAmendment };
        this.populateUI(this.contractAmendment);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractAmendment): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AmendmentNo: obj.AmendmentNo || '',
FromVersionNo: obj.FromVersionNo || 0,
ToVersionNo: obj.ToVersionNo || 0,
AmendmentTypeCode: obj.AmendmentTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
Reason: obj.Reason || '',
AmendmentStatusCode: obj.AmendmentStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
ExecutedOn:  obj.ExecutedOn || new Date(),
 
      }
    );
   
	 this.Caption = "ContractAmendment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/amendments/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractAmendment = { ...this.objMaster };
	var obj  = this.contractAmendment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AmendmentNo: obj.AmendmentNo || '',
FromVersionNo: obj.FromVersionNo || 0,
ToVersionNo: obj.ToVersionNo || 0,
AmendmentTypeCode: obj.AmendmentTypeCode || '',
RequestedDate:  obj.RequestedDate || new Date(),
EffectiveDate:  obj.EffectiveDate || new Date(),
Reason: obj.Reason || '',
AmendmentStatusCode: obj.AmendmentStatusCode || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
ExecutedOn:  obj.ExecutedOn || new Date(),
 
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
     LeaseContractId:  formValues.LeaseContractId || 0,
AmendmentNo:  formValues.AmendmentNo || null,
FromVersionNo:  formValues.FromVersionNo || 0,
ToVersionNo:  formValues.ToVersionNo || 0,
AmendmentTypeCode:  formValues.AmendmentTypeCode || null,
RequestedDate:  formValues.RequestedDate || null,
EffectiveDate:  formValues.EffectiveDate || null,
Reason:  formValues.Reason || null,
AmendmentStatusCode:  formValues.AmendmentStatusCode || null,
ApprovalRequestId:  formValues.ApprovalRequestId || 0,
ExecutedOn:  formValues.ExecutedOn || null,

    } as IContractAmendment ;
	
	this.spinner.show();  	   
    this.contractAmendmentService.update(this.contractAmendment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractAmendment +  'Details Updated sucessfully.');
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
