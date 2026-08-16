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
import { IAssetStatus } from './assetStatus';
import { AssetStatusService } from './assetStatus.service';


@Component({
  selector: 'app-assetStatus-edit',
  standalone: false,
  templateUrl: './assetStatus-edit.component.html',
  providers: [ MessageService]
})
export class AssetStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetStatus: IAssetStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetStatus = {} as IAssetStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetStatusService: AssetStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
IsLeaseable: new FormControl(false, [Validators.required]),
IsTerminal: new FormControl(false, [Validators.required]),
SortOrder: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.recordstatusOptions.push({Text: '', Value: '' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetStatus };
        this.populateUI(this.assetStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsLeaseable:  obj.IsLeaseable || false,
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetStatus/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetStatus = { ...this.objMaster };
	var obj  = this.assetStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsLeaseable:  obj.IsLeaseable || false,
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
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
     StatusCode:  formValues.StatusCode || null,
StatusName:  formValues.StatusName || null,
IsLeaseable:  formValues.IsLeaseable || null,
IsTerminal:  formValues.IsTerminal || null,
SortOrder:  formValues.SortOrder || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetStatus ;
	
	this.spinner.show();  	   
    this.assetStatusService.update(this.assetStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetStatus +  'Details Updated sucessfully.');
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
