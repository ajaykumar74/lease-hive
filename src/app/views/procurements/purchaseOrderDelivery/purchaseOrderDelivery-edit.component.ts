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
import { IPurchaseOrderDelivery } from './purchaseOrderDelivery';
import { PurchaseOrderDeliveryService } from './purchaseOrderDelivery.service';


@Component({
  selector: 'app-purchaseOrderDelivery-edit',
  standalone: false,
  templateUrl: './purchaseOrderDelivery-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOrderDeliveryEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  purchaseOrderDelivery: IPurchaseOrderDelivery = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  purchaseorderlineidOptions: ISelectItem[] = [];
deliverylocationidOptions: ISelectItem[] = [];
receivingorganisationunitidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOrderDelivery = {} as IPurchaseOrderDelivery;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOrderDeliveryService: PurchaseOrderDeliveryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrderDelivery };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PurchaseOrderLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduleNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
DeliveryLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduledQuantity: new FormControl(0, [Validators.required]),
PromisedDate: new FormControl(new Date(), []),
ReceivingOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Instructions: new FormControl('', [Validators.maxLength(500), ]), 

    });

   this.purchaseorderlineidOptions.push({Text: 'PurchaseOrderLineId1', Value: 'PurchaseOrderLineId1' });
this.purchaseorderlineidOptions.push({Text: 'PurchaseOrderLineId2', Value: 'PurchaseOrderLineId2' });
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId1', Value: 'DeliveryLocationId1' });
this.deliverylocationidOptions.push({Text: 'DeliveryLocationId2', Value: 'DeliveryLocationId2' });
this.receivingorganisationunitidOptions.push({Text: 'ReceivingOrganisationUnitId1', Value: 'ReceivingOrganisationUnitId1' });
this.receivingorganisationunitidOptions.push({Text: 'ReceivingOrganisationUnitId2', Value: 'ReceivingOrganisationUnitId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.purchaseOrderDeliveryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOrderDelivery = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOrderDelivery };
        this.populateUI(this.purchaseOrderDelivery);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOrderDelivery): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
ScheduleNo: obj.ScheduleNo || 0,
DeliveryLocationId: obj.DeliveryLocationId || 0,
ScheduledQuantity: obj.ScheduledQuantity || 0,
PromisedDate:  obj.PromisedDate || new Date(),
ReceivingOrganisationUnitId: obj.ReceivingOrganisationUnitId || 0,
Instructions: obj.Instructions || '',
 
      }
    );
   
	 this.Caption = "PurchaseOrderDelivery Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/purchaseOrderDelivery/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOrderDelivery = { ...this.objMaster };
	var obj  = this.purchaseOrderDelivery;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PurchaseOrderLineId: obj.PurchaseOrderLineId || 0,
ScheduleNo: obj.ScheduleNo || 0,
DeliveryLocationId: obj.DeliveryLocationId || 0,
ScheduledQuantity: obj.ScheduledQuantity || 0,
PromisedDate:  obj.PromisedDate || new Date(),
ReceivingOrganisationUnitId: obj.ReceivingOrganisationUnitId || 0,
Instructions: obj.Instructions || '',
 
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
     PurchaseOrderLineId:  formValues.PurchaseOrderLineId || null,
ScheduleNo:  formValues.ScheduleNo || null,
DeliveryLocationId:  formValues.DeliveryLocationId || null,
ScheduledQuantity:  formValues.ScheduledQuantity || null,
PromisedDate:  formValues.PromisedDate || null,
ReceivingOrganisationUnitId:  formValues.ReceivingOrganisationUnitId || null,
Instructions:  formValues.Instructions || null,

    } as IPurchaseOrderDelivery ;
	
	this.spinner.show();  	   
    this.purchaseOrderDeliveryService.update(this.purchaseOrderDelivery.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOrderDelivery +  'Details Updated sucessfully.');
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
