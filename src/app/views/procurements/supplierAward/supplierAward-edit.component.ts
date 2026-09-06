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
import { ISupplierAward } from './supplierAward';
import { SupplierAwardService } from './supplierAward.service';


@Component({
  selector: 'app-supplierAward-edit',
  standalone: false,
  templateUrl: './supplierAward-edit.component.html',
  providers: [ MessageService]
})
export class SupplierAwardEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supplierAward: ISupplierAward = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rfqidOptions: ISelectItem[] = [];
supplierquotationidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
approvalrequestidOptions: ISelectItem[] = [];
awardedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierAward = {} as ISupplierAward;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierAwardService: SupplierAwardService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierAward };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierQuotationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AwardDateTime: new FormControl(new Date(), [Validators.required]),
AwardAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SelectionReason: new FormControl('', [Validators.maxLength(100), ]), 
ApprovalRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AwardedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.rfqidOptions.push({Text: 'RFQId1', Value: 'RFQId1' });
this.rfqidOptions.push({Text: 'RFQId2', Value: 'RFQId2' });
this.supplierquotationidOptions.push({Text: 'SupplierQuotationId1', Value: 'SupplierQuotationId1' });
this.supplierquotationidOptions.push({Text: 'SupplierQuotationId2', Value: 'SupplierQuotationId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId1', Value: 'ApprovalRequestId1' });
this.approvalrequestidOptions.push({Text: 'ApprovalRequestId2', Value: 'ApprovalRequestId2' });
this.awardedbyOptions.push({Text: 'AwardedBy1', Value: 'AwardedBy1' });
this.awardedbyOptions.push({Text: 'AwardedBy2', Value: 'AwardedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supplierAwardService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierAward = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierAward };
        this.populateUI(this.supplierAward);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierAward): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierQuotationId: obj.SupplierQuotationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
AwardDateTime:  obj.AwardDateTime || new Date(),
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectionReason: obj.SelectionReason || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
AwardedBy: obj.AwardedBy || 0,
 
      }
    );
   
	 this.Caption = "SupplierAward Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/awards/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierAward = { ...this.objMaster };
	var obj  = this.supplierAward;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierQuotationId: obj.SupplierQuotationId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
AwardDateTime:  obj.AwardDateTime || new Date(),
AwardAmount: obj.AwardAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectionReason: obj.SelectionReason || '',
ApprovalRequestId: obj.ApprovalRequestId || 0,
AwardedBy: obj.AwardedBy || 0,
 
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
     RFQId:  formValues.RFQId || 0,
SupplierQuotationId:  formValues.SupplierQuotationId || 0,
SupplierPartyId:  formValues.SupplierPartyId || 0,
AwardDateTime:  formValues.AwardDateTime || null,
TechnicalScore:  formValues.TechnicalScore || 0,
CommercialScore:  formValues.CommercialScore || 0,
AwardAmount:  formValues.AwardAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
SelectionReason:  formValues.SelectionReason || null,
ApprovalRequestId:  formValues.ApprovalRequestId || 0,
AwardedBy:  formValues.AwardedBy || 0,

    } as ISupplierAward ;
	
	this.spinner.show();  	   
    this.supplierAwardService.update(this.supplierAward.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierAward +  'Details Updated sucessfully.');
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
