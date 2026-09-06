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
import { IPurchaseOrderAmendment } from './purchaseOrderAmendment';
import { PurchaseOrderAmendmentService } from './purchaseOrderAmendment.service';


@Component({
  selector: 'app-purchaseOrderAmendment-edit',
  standalone: false,
  templateUrl: './purchaseOrderAmendment-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOrderAmendmentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  purchaseOrderAmendment: IPurchaseOrderAmendment = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseorderidOptions: ISelectItem[] = [];
reasoncodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
changedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOrderAmendment = {} as IPurchaseOrderAmendment;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOrderAmendmentService: PurchaseOrderAmendmentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrderAmendment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PurchaseOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AmendmentNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
AmendmentDate: new FormControl(new Date(), [Validators.required]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Reason: new FormControl('', [Validators.maxLength(100), ]), 
PreviousVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
NewVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ChangedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChangedOn: new FormControl(new Date(), [Validators.required]),

    });

   this.purchaseorderidOptions.push({Text: 'PurchaseOrderId1', Value: 'PurchaseOrderId1' });
this.purchaseorderidOptions.push({Text: 'PurchaseOrderId2', Value: 'PurchaseOrderId2' });
this.reasoncodeOptions.push({Text: 'PRICE', Value: 'PRICE' });
this.reasoncodeOptions.push({Text: 'QTY', Value: 'QTY' });
this.reasoncodeOptions.push({Text: 'DATE', Value: 'DATE' });
this.reasoncodeOptions.push({Text: 'TERMS', Value: 'TERMS' });
this.reasoncodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId1', Value: 'ApprovalRequestId1' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId2', Value: 'ApprovalRequestId2' });
this.changedbyOptions.push({Text: 'ChangedBy1', Value: 'ChangedBy1' });
this.changedbyOptions.push({Text: 'ChangedBy2', Value: 'ChangedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.purchaseOrderAmendmentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOrderAmendment = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOrderAmendment };
        this.populateUI(this.purchaseOrderAmendment);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOrderAmendment): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderId: obj.PurchaseOrderId || 0,
AmendmentNo: obj.AmendmentNo || 0,
AmendmentDate:  obj.AmendmentDate || new Date(),
ReasonCode: obj.ReasonCode || '',
Reason: obj.Reason || '',
PreviousVersionNo: obj.PreviousVersionNo || 0,
NewVersionNo: obj.NewVersionNo || 0,
ApprovalRequestId: obj.ApprovalRequestId || 0,
ChangedBy: obj.ChangedBy || 0,
ChangedOn:  obj.ChangedOn || new Date(),
 
      }
    );
   
	 this.Caption = "PurchaseOrderAmendment Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/purchaseOrderAmendment/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOrderAmendment = { ...this.objMaster };
	var obj  = this.purchaseOrderAmendment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderId: obj.PurchaseOrderId || 0,
AmendmentNo: obj.AmendmentNo || 0,
AmendmentDate:  obj.AmendmentDate || new Date(),
ReasonCode: obj.ReasonCode || '',
Reason: obj.Reason || '',
PreviousVersionNo: obj.PreviousVersionNo || 0,
NewVersionNo: obj.NewVersionNo || 0,
ApprovalRequestId: obj.ApprovalRequestId || 0,
ChangedBy: obj.ChangedBy || 0,
ChangedOn:  obj.ChangedOn || new Date(),
 
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
     PurchaseOrderId:  formValues.PurchaseOrderId || null,
AmendmentNo:  formValues.AmendmentNo || null,
AmendmentDate:  formValues.AmendmentDate || null,
ReasonCode:  formValues.ReasonCode || null,
Reason:  formValues.Reason || null,
PreviousVersionNo:  formValues.PreviousVersionNo || null,
NewVersionNo:  formValues.NewVersionNo || null,
ApprovalRequestId:  formValues.ApprovalRequestId || null,
ChangedBy:  formValues.ChangedBy || null,
ChangedOn:  formValues.ChangedOn || null,

    } as IPurchaseOrderAmendment ;
	
	this.spinner.show();  	   
    this.purchaseOrderAmendmentService.update(this.purchaseOrderAmendment.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOrderAmendment +  'Details Updated sucessfully.');
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
