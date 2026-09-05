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
import { ISupplierReturn } from './supplierReturn';
import { SupplierReturnService } from './supplierReturn.service';


@Component({
  selector: 'app-supplierReturn-edit',
  standalone: false,
  templateUrl: './supplierReturn-edit.component.html',
  providers: [ MessageService]
})
export class SupplierReturnEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  supplierReturn: ISupplierReturn = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierReturn = {} as ISupplierReturn;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierReturnService: SupplierReturnService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierReturn };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnDate: new FormControl(new Date(), [Validators.required]),
ReturnReference: new FormControl('', [Validators.maxLength(50), ]), 
CreditExpectedAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('SupplierReturnStatusCode');
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
    this.supplierReturnService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierReturn = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierReturn };
        this.populateUI(this.supplierReturn);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierReturn): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReturnDate:  obj.ReturnDate || new Date(),
ReturnReference: obj.ReturnReference || '',
CreditExpectedAmount: obj.CreditExpectedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "SupplierReturn Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/returns/supplier/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierReturn = { ...this.objMaster };
	var obj  = this.supplierReturn;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
ReturnDate:  obj.ReturnDate || new Date(),
ReturnReference: obj.ReturnReference || '',
CreditExpectedAmount: obj.CreditExpectedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
StatusCode: obj.StatusCode || '',
Remarks: obj.Remarks || '',
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
     DisposalCaseId:  formValues.DisposalCaseId || null,
AssetId:  formValues.AssetId || null,
SupplierPartyId:  formValues.SupplierPartyId || null,
ReturnDate:  formValues.ReturnDate || null,
ReturnReference:  formValues.ReturnReference || null,
CreditExpectedAmount:  formValues.CreditExpectedAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
StatusCode:  formValues.StatusCode || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ISupplierReturn ;
	
	this.spinner.show();  	   
    this.supplierReturnService.update(this.supplierReturn.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierReturn +  'Details Updated sucessfully.');
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
