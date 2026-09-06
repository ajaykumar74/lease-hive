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
import { IReceiptInspection } from './receiptInspection';
import { ReceiptInspectionService } from './receiptInspection.service';


@Component({
  selector: 'app-receiptInspection-edit',
  standalone: false,
  templateUrl: './receiptInspection-edit.component.html',
  providers: [ MessageService]
})
export class ReceiptInspectionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  receiptInspection: IReceiptInspection = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  goodsreceiptlineidOptions: ISelectItem[] = [];
goodsreceiptserialidOptions: ISelectItem[] = [];
inspectoruseridOptions: ISelectItem[] = [];
resultcodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReceiptInspection = {} as IReceiptInspection;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private receiptInspectionService: ReceiptInspectionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.receiptInspection };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
GoodsReceiptLineId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
GoodsReceiptSerialId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InspectionDateTime: new FormControl(new Date(), [Validators.required]),
InspectorUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ResultCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChecklistJson: new FormControl('', [Validators.maxLength(8000), ]), 
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
this.loggedInUserService.bindEntityLookup(this.editForm, 'DocumentId', 'documents',
      options => this.documentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'GoodsReceiptLineId', 'goods-receipt-lines',
      options => this.goodsreceiptlineidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'GoodsReceiptSerialId', 'goods-receipt-serials',
      options => this.goodsreceiptserialidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {'GoodsReceiptLineId':'GoodsReceiptLineId'});
this.loggedInUserService.bindEntityLookup(this.editForm, 'InspectorUserId', 'application-users',
      options => this.inspectoruseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.resultcodeOptions = this.loggedInUserService.getPicklistOptions('ReceiptInspectionResultCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.receiptInspectionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.receiptInspection = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.receiptInspection };
        this.populateUI(this.receiptInspection);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IReceiptInspection): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
GoodsReceiptSerialId: obj.GoodsReceiptSerialId || 0,
InspectionDateTime:  obj.InspectionDateTime || new Date(),
InspectorUserId: obj.InspectorUserId || 0,
ResultCode: obj.ResultCode || '',
ChecklistJson: obj.ChecklistJson || '',
Remarks: obj.Remarks || '',
DocumentId: obj.DocumentId || 0,
 
      }
    );
   
	 this.Caption = "ReceiptInspection Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/inspections/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.receiptInspection = { ...this.objMaster };
	var obj  = this.receiptInspection;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  GoodsReceiptLineId: obj.GoodsReceiptLineId || 0,
GoodsReceiptSerialId: obj.GoodsReceiptSerialId || 0,
InspectionDateTime:  obj.InspectionDateTime || new Date(),
InspectorUserId: obj.InspectorUserId || 0,
ResultCode: obj.ResultCode || '',
ChecklistJson: obj.ChecklistJson || '',
Remarks: obj.Remarks || '',
DocumentId: obj.DocumentId || 0,
 
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
     GoodsReceiptLineId:  formValues.GoodsReceiptLineId || 0,
GoodsReceiptSerialId:  formValues.GoodsReceiptSerialId || 0,
InspectionDateTime:  formValues.InspectionDateTime || null,
InspectorUserId:  formValues.InspectorUserId || 0,
ResultCode:  formValues.ResultCode || null,
ChecklistJson:  formValues.ChecklistJson || null,
Remarks:  formValues.Remarks || null,
DocumentId:  formValues.DocumentId || 0,

    } as IReceiptInspection ;
	
	this.spinner.show();  	   
    this.receiptInspectionService.update(this.receiptInspection.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ReceiptInspection +  'Details Updated sucessfully.');
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
