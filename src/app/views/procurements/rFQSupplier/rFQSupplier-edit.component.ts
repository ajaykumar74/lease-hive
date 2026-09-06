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
import { IRFQSupplier } from './rFQSupplier';
import { RFQSupplierService } from './rFQSupplier.service';


@Component({
  selector: 'app-rFQSupplier-edit',
  standalone: false,
  templateUrl: './rFQSupplier-edit.component.html',
  providers: [ MessageService]
})
export class RFQSupplierEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  rFQSupplier: IRFQSupplier = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  rfqidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
supplierserviceareaidOptions: ISelectItem[] = [];
invitationstatuscodeOptions: ISelectItem[] = [];
suppliercontactidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRFQSupplier = {} as IRFQSupplier;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private rFQSupplierService: RFQSupplierService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.rFQSupplier };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
RFQId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierServiceAreaId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InvitationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InvitedOn: new FormControl(new Date(), [Validators.required]),
RespondedOn: new FormControl(new Date(), []),
SupplierContactId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'RFQId', 'rfqs',
      options => this.rfqidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierContactId', 'party-contacts',
      options => this.suppliercontactidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {'PartyId':'SupplierPartyId'});
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties',
      options => this.supplierpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierServiceAreaId', 'supplier-service-areas',
      options => this.supplierserviceareaidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {'PartyId':'SupplierPartyId'});
this.invitationstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RFQSupplierInvitationStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.rFQSupplierService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.rFQSupplier = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.rFQSupplier };
        this.populateUI(this.rFQSupplier);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "RFQSupplier Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/rfqs/suppliers/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     RFQId:  formValues.RFQId || 0,
SupplierPartyId:  formValues.SupplierPartyId || 0,
SupplierServiceAreaId:  formValues.SupplierServiceAreaId || 0,
InvitationStatusCode:  formValues.InvitationStatusCode || null,
InvitedOn:  formValues.InvitedOn || null,
RespondedOn:  formValues.RespondedOn || null,
SupplierContactId:  formValues.SupplierContactId || 0,

    } as IRFQSupplier ;
	
	this.spinner.show();  	   
    this.rFQSupplierService.update(this.rFQSupplier.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(RFQSupplier +  'Details Updated sucessfully.');
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
