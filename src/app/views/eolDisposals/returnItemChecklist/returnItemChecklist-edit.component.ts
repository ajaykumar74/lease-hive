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
import { IReturnItemChecklist } from './returnItemChecklist';
import { ReturnItemChecklistService } from './returnItemChecklist.service';


@Component({
  selector: 'app-returnItemChecklist-edit',
  standalone: false,
  templateUrl: './returnItemChecklist-edit.component.html',
  providers: [ MessageService]
})
export class ReturnItemChecklistEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  returnItemChecklist: IReturnItemChecklist = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetreturnidOptions: ISelectItem[] = [];
conditioncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IReturnItemChecklist = {} as IReturnItemChecklist;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private returnItemChecklistService: ReturnItemChecklistService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.returnItemChecklist };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetReturnId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ItemCode: new FormControl('', [Validators.maxLength(20), ]), 
ItemDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ExpectedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReturnedQuantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ConditionCode: new FormControl('', [Validators.maxLength(20), ]), 
ChargeableFlag: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetReturnId', 'asset-returns',
      options => this.assetreturnidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.conditioncodeOptions = this.loggedInUserService.getPicklistOptions('ConditionCode');
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
    this.returnItemChecklistService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.returnItemChecklist = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.returnItemChecklist };
        this.populateUI(this.returnItemChecklist);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IReturnItemChecklist): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetReturnId: obj.AssetReturnId || 0,
LineNo: obj.LineNo || 0,
ItemCode: obj.ItemCode || '',
ItemDescription: obj.ItemDescription || '',
ExpectedQuantity: obj.ExpectedQuantity || 0,
ReturnedQuantity: obj.ReturnedQuantity || 0,
ConditionCode: obj.ConditionCode || '',
ChargeableFlag:  obj.ChargeableFlag || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "ReturnItemChecklist Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/returns/checklists/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.returnItemChecklist = { ...this.objMaster };
	var obj  = this.returnItemChecklist;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetReturnId: obj.AssetReturnId || 0,
LineNo: obj.LineNo || 0,
ItemCode: obj.ItemCode || '',
ItemDescription: obj.ItemDescription || '',
ExpectedQuantity: obj.ExpectedQuantity || 0,
ReturnedQuantity: obj.ReturnedQuantity || 0,
ConditionCode: obj.ConditionCode || '',
ChargeableFlag:  obj.ChargeableFlag || false,
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
     AssetReturnId:  formValues.AssetReturnId || 0,
LineNo:  formValues.LineNo || 0,
ItemCode:  formValues.ItemCode || null,
ItemDescription:  formValues.ItemDescription || null,
ExpectedQuantity:  formValues.ExpectedQuantity || 0,
ReturnedQuantity:  formValues.ReturnedQuantity || 0,
ConditionCode:  formValues.ConditionCode || null,
ChargeableFlag:  formValues.ChargeableFlag || false,
RecordStatus:  formValues.RecordStatus || null,

    } as IReturnItemChecklist ;
	
	this.spinner.show();  	   
    this.returnItemChecklistService.update(this.returnItemChecklist.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ReturnItemChecklist +  'Details Updated sucessfully.');
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
