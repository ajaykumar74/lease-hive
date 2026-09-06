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
import { ISupplierQuotationLine } from './supplierQuotationLine';
import { SupplierQuotationLineService } from './supplierQuotationLine.service';


@Component({
  selector: 'app-supplierQuotationLine-edit',
  standalone: false,
  templateUrl: './supplierQuotationLine-edit.component.html',
  providers: [ MessageService]
})
export class SupplierQuotationLineEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  supplierQuotationLine: ISupplierQuotationLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  supplierquotationidOptions: ISelectItem[] = [];
rfqlineidOptions: ISelectItem[] = [];
compliancecodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ISupplierQuotationLine = {} as ISupplierQuotationLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private supplierQuotationLineService: SupplierQuotationLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.supplierQuotationLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SupplierQuotationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RFQLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Quantity: new FormControl(0, [Validators.required]),
UnitPrice: new FormControl(0, [Validators.required]),
DiscountAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, [Validators.required]),
LineTotal: new FormControl(0, [Validators.required]),
DeliveryDate: new FormControl(new Date(), []),
ComplianceCode: new FormControl('', [Validators.maxLength(20), ]), 
DeviationNotes: new FormControl('', [Validators.maxLength(1000), ]), 

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'RFQLineId', 'rfq-lines',
      options => this.rfqlineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierQuotationId', 'supplier-quotations',
      options => this.supplierquotationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.compliancecodeOptions = this.loggedInUserService.getPicklistOptions('SupplierQuotationLineComplianceCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.supplierQuotationLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.supplierQuotationLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.supplierQuotationLine };
        this.populateUI(this.supplierQuotationLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ISupplierQuotationLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierQuotationId: obj.SupplierQuotationId || 0,
RFQLineId: obj.RFQLineId || 0,
Quantity: obj.Quantity || 0,
UnitPrice: obj.UnitPrice || 0,
DiscountAmount: obj.DiscountAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
DeliveryDate:  obj.DeliveryDate || new Date(),
ComplianceCode: obj.ComplianceCode || '',
DeviationNotes: obj.DeviationNotes || '',
 
      }
    );
   
	 this.Caption = "SupplierQuotationLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/supplier-quotations/lines/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.supplierQuotationLine = { ...this.objMaster };
	var obj  = this.supplierQuotationLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SupplierQuotationId: obj.SupplierQuotationId || 0,
RFQLineId: obj.RFQLineId || 0,
Quantity: obj.Quantity || 0,
UnitPrice: obj.UnitPrice || 0,
DiscountAmount: obj.DiscountAmount || 0,
TaxAmount: obj.TaxAmount || 0,
LineTotal: obj.LineTotal || 0,
DeliveryDate:  obj.DeliveryDate || new Date(),
ComplianceCode: obj.ComplianceCode || '',
DeviationNotes: obj.DeviationNotes || '',
 
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
     SupplierQuotationId:  formValues.SupplierQuotationId || 0,
RFQLineId:  formValues.RFQLineId || 0,
Quantity:  formValues.Quantity || 0,
UnitPrice:  formValues.UnitPrice || 0,
DiscountAmount:  formValues.DiscountAmount || 0,
TaxAmount:  formValues.TaxAmount || 0,
LineTotal:  formValues.LineTotal || 0,
DeliveryDate:  formValues.DeliveryDate || null,
ComplianceCode:  formValues.ComplianceCode || null,
DeviationNotes:  formValues.DeviationNotes || null,

    } as ISupplierQuotationLine ;
	
	this.spinner.show();  	   
    this.supplierQuotationLineService.update(this.supplierQuotationLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(SupplierQuotationLine +  'Details Updated sucessfully.');
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
