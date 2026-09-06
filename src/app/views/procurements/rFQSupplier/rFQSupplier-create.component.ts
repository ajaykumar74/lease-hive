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
import { IRFQSupplier } from './rFQSupplier';
import { RFQSupplierService } from './rFQSupplier.service';

@Component({
  selector: 'app-rFQSupplier-create',
  standalone: false,
  templateUrl: './rFQSupplier-create.component.html' ,
   providers: [ MessageService]
})
export class RFQSupplierCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rFQSupplier: IRFQSupplier = null;
  rfqidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
supplierserviceareaidOptions: ISelectItem[] = [];
invitationstatuscodeOptions: ISelectItem[] = [];
suppliercontactidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IRFQSupplier = {} as IRFQSupplier;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private rFQSupplierService: RFQSupplierService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.rFQSupplier };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierServiceAreaId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InvitationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InvitedOn: new FormControl(new Date(), [Validators.required]),
RespondedOn: new FormControl(new Date(), []),
SupplierContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create RFQSupplier';
    this.rfqidOptions.push({Text: 'RFQId1', Value: 'RFQId1' });
this.rfqidOptions.push({Text: 'RFQId2', Value: 'RFQId2' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId1', Value: 'SupplierPartyId1' });
this.supplierpartyidOptions.push({Text: 'SupplierPartyId2', Value: 'SupplierPartyId2' });
this.supplierserviceareaidOptions.push({Text: 'SupplierServiceAreaId1', Value: 'SupplierServiceAreaId1' });
this.supplierserviceareaidOptions.push({Text: 'SupplierServiceAreaId2', Value: 'SupplierServiceAreaId2' });
this.invitationstatuscodeOptions.push({Text: 'INVITED', Value: 'INVITED' });
this.invitationstatuscodeOptions.push({Text: 'VIEWED', Value: 'VIEWED' });
this.invitationstatuscodeOptions.push({Text: 'RESPONDED', Value: 'RESPONDED' });
this.invitationstatuscodeOptions.push({Text: 'DECLINED', Value: 'DECLINED' });
this.suppliercontactidOptions.push({Text: 'SupplierContactId1', Value: 'SupplierContactId1' });
this.suppliercontactidOptions.push({Text: 'SupplierContactId2', Value: 'SupplierContactId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.rFQSupplierService.getById(this.selectedId).subscribe({
      next: data => {
        this.rFQSupplier = data;
        this.objMaster = { ...this.rFQSupplier };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IRFQSupplier): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierServiceAreaId: obj.SupplierServiceAreaId || 0,
InvitationStatusCode: obj.InvitationStatusCode || '',
InvitedOn:  obj.InvitedOn || new Date(),
RespondedOn:  obj.RespondedOn || new Date(),
SupplierContactId: obj.SupplierContactId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/rFQSuppliers/create']);
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
    this.rFQSupplier = { ...this.objMaster };
    var obj  = this.rFQSupplier;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  RFQId: obj.RFQId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierServiceAreaId: obj.SupplierServiceAreaId || 0,
InvitationStatusCode: obj.InvitationStatusCode || '',
InvitedOn:  obj.InvitedOn || new Date(),
RespondedOn:  obj.RespondedOn || new Date(),
SupplierContactId: obj.SupplierContactId || 0,
 
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
SupplierPartyId: formValues.SupplierPartyId || 0,
SupplierServiceAreaId: formValues.SupplierServiceAreaId || 0,
InvitationStatusCode: formValues.InvitationStatusCode || null,
InvitedOn: formValues.InvitedOn || null,
RespondedOn: formValues.RespondedOn || null,
SupplierContactId: formValues.SupplierContactId || 0,

    } as IRFQSupplier ; 
	
	  this.spinner.show(); 
    this.rFQSupplierService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(RFQSupplier +  'Details Updated sucessfully.');
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



