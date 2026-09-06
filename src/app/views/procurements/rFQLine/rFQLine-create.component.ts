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
import { IRFQLine } from './rFQLine';
import { RFQLineService } from './rFQLine.service';

@Component({
  selector: 'app-rFQLine-create',
  standalone: false,
  templateUrl: './rFQLine-create.component.html' ,
   providers: [ MessageService]
})
export class RFQLineCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rFQLine: IRFQLine = null;
  rfqidOptions: ISelectItem[] = [];
purchaserequisitionlineidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IRFQLine = {} as IRFQLine;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private rFQLineService: RFQLineService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.rFQLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseRequisitionLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required]),
UOMId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SpecificationsJson: new FormControl('', [Validators.maxLength(8000), ]), 
RequiredByDate: new FormControl(new Date(), []),

    });
    this.Caption = 'Create RFQLine';
    this.rfqidOptions.push({Text: 'RFQId1', Value: 'RFQId1' });
this.rfqidOptions.push({Text: 'RFQId2', Value: 'RFQId2' });
this.purchaserequisitionlineidOptions.push({Text: 'PurchaseRequisitionLineId1', Value: 'PurchaseRequisitionLineId1' });
this.purchaserequisitionlineidOptions.push({Text: 'PurchaseRequisitionLineId2', Value: 'PurchaseRequisitionLineId2' });
this.uomidOptions.push({Text: 'UOMId1', Value: 'UOMId1' });
this.uomidOptions.push({Text: 'UOMId2', Value: 'UOMId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.rFQLineService.getById(this.selectedId).subscribe({
      next: data => {
        this.rFQLine = data;
        this.objMaster = { ...this.rFQLine };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IRFQLine): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
PurchaseRequisitionLineId: obj.PurchaseRequisitionLineId || 0,
LineNo: obj.LineNo || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
SpecificationsJson: obj.SpecificationsJson || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/rfqs/lines/create']);
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
    this.rFQLine = { ...this.objMaster };
    var obj  = this.rFQLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
PurchaseRequisitionLineId: obj.PurchaseRequisitionLineId || 0,
LineNo: obj.LineNo || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
SpecificationsJson: obj.SpecificationsJson || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     RFQId: formValues.RFQId || 0,
PurchaseRequisitionLineId: formValues.PurchaseRequisitionLineId || 0,
LineNo: formValues.LineNo || 0,
Description: formValues.Description || null,
Quantity: formValues.Quantity || 0,
UOMId: formValues.UOMId || 0,
SpecificationsJson: formValues.SpecificationsJson || null,
RequiredByDate: formValues.RequiredByDate || null,

    } as IRFQLine ; 
	
	  this.spinner.show(); 
    this.rFQLineService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(RFQLine +  'Details Updated sucessfully.');
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



