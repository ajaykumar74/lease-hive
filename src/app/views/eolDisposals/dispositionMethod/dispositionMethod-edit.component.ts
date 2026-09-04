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
import { IDispositionMethod } from './dispositionMethod';
import { DispositionMethodService } from './dispositionMethod.service';


@Component({
  selector: 'app-dispositionMethod-edit',
  standalone: false,
  templateUrl: './dispositionMethod-edit.component.html',
  providers: [ MessageService]
})
export class DispositionMethodEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  dispositionMethod: IDispositionMethod = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDispositionMethod = {} as IDispositionMethod;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private dispositionMethodService: DispositionMethodService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.dispositionMethod };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DispositionMethodCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DispositionMethodName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
RequiresBuyerFlag: new FormControl(false, [Validators.required]),
RequiresApprovalFlag: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.dispositionMethodService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.dispositionMethod = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.dispositionMethod };
        this.populateUI(this.dispositionMethod);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IDispositionMethod): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DispositionMethodCode: obj.DispositionMethodCode || '',
DispositionMethodName: obj.DispositionMethodName || '',
RequiresBuyerFlag:  obj.RequiresBuyerFlag || false,
RequiresApprovalFlag:  obj.RequiresApprovalFlag || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "DispositionMethod Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dispositionMethod/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.dispositionMethod = { ...this.objMaster };
	var obj  = this.dispositionMethod;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DispositionMethodCode: obj.DispositionMethodCode || '',
DispositionMethodName: obj.DispositionMethodName || '',
RequiresBuyerFlag:  obj.RequiresBuyerFlag || false,
RequiresApprovalFlag:  obj.RequiresApprovalFlag || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
     DispositionMethodCode:  formValues.DispositionMethodCode || null,
DispositionMethodName:  formValues.DispositionMethodName || null,
RequiresBuyerFlag:  formValues.RequiresBuyerFlag || null,
RequiresApprovalFlag:  formValues.RequiresApprovalFlag || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IDispositionMethod ;
	
	this.spinner.show();  	   
    this.dispositionMethodService.update(this.dispositionMethod.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DispositionMethod +  'Details Updated sucessfully.');
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
