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
import { IProcurementHandoff } from './procurementHandoff';
import { ProcurementHandoffService } from './procurementHandoff.service';


@Component({
  selector: 'app-procurementHandoff-edit',
  standalone: false,
  templateUrl: './procurementHandoff-edit.component.html',
  providers: [ MessageService]
})
export class ProcurementHandoffEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  procurementHandoff: IProcurementHandoff = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
targetmodulecodeOptions: ISelectItem[] = [];
handoffstatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IProcurementHandoff = {} as IProcurementHandoff;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private procurementHandoffService: ProcurementHandoffService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.procurementHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TargetModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffDateTime: new FormControl(new Date(), [Validators.required]),
TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ValidationJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });

   this.referencetypeOptions.push({Text: 'GRN', Value: 'GRN' });
this.referencetypeOptions.push({Text: 'INVOICE', Value: 'INVOICE' });
this.targetmodulecodeOptions.push({Text: 'ASSET', Value: 'ASSET' });
this.targetmodulecodeOptions.push({Text: 'INVENTORY', Value: 'INVENTORY' });
this.targetmodulecodeOptions.push({Text: 'AP', Value: 'AP' });
this.handoffstatuscodeOptions.push({Text: 'READY', Value: 'READY' });
this.handoffstatuscodeOptions.push({Text: 'SENT', Value: 'SENT' });
this.handoffstatuscodeOptions.push({Text: 'ACCEPTED', Value: 'ACCEPTED' });
this.handoffstatuscodeOptions.push({Text: 'FAILED', Value: 'FAILED' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.procurementHandoffService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.procurementHandoff = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.procurementHandoff };
        this.populateUI(this.procurementHandoff);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IProcurementHandoff): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
      }
    );
   
	 this.Caption = "ProcurementHandoff Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/procurementHandoff/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.procurementHandoff = { ...this.objMaster };
	var obj  = this.procurementHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
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
     ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
TargetModuleCode:  formValues.TargetModuleCode || null,
HandoffStatusCode:  formValues.HandoffStatusCode || null,
HandoffDateTime:  formValues.HandoffDateTime || null,
TargetReferenceId:  formValues.TargetReferenceId || null,
ValidationJson:  formValues.ValidationJson || null,

    } as IProcurementHandoff ;
	
	this.spinner.show();  	   
    this.procurementHandoffService.update(this.procurementHandoff.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ProcurementHandoff +  'Details Updated sucessfully.');
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
