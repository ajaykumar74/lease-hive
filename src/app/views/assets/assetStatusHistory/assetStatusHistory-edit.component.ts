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
import { IAssetStatusHistory } from './assetStatusHistory';
import { AssetStatusHistoryService } from './assetStatusHistory.service';


@Component({
  selector: 'app-assetStatusHistory-edit',
  standalone: false,
  templateUrl: './assetStatusHistory-edit.component.html',
  providers: [ MessageService]
})
export class AssetStatusHistoryEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetStatusHistory: IAssetStatusHistory = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  fromstatusidOptions: ISelectItem[] = [];
tostatusidOptions: ISelectItem[] = [];
reasoncodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetStatusHistory = {} as IAssetStatusHistory;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetStatusHistoryService: AssetStatusHistoryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetStatusHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
FromStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Remarks: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'FromStatusId', 'asset-statuses',
      options => this.fromstatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ToStatusId', 'asset-statuses',
      options => this.tostatusidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.reasoncodeOptions.push({Text: 'StatusChange1', Value: 'StatusChange1' });
this.reasoncodeOptions.push({Text: 'StatusChange2', Value: 'StatusChange2' });
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
    this.assetStatusHistoryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetStatusHistory = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetStatusHistory };
        this.populateUI(this.assetStatusHistory);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetStatusHistory): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromStatusId: obj.FromStatusId || 0,
ToStatusId: obj.ToStatusId || 0,
ReasonCode: obj.ReasonCode || '',
Remarks: obj.Remarks || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetStatusHistory Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetStatusHistory/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetStatusHistory = { ...this.objMaster };
	var obj  = this.assetStatusHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromStatusId: obj.FromStatusId || 0,
ToStatusId: obj.ToStatusId || 0,
ReasonCode: obj.ReasonCode || '',
Remarks: obj.Remarks || '',
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
     FromStatusId:  formValues.FromStatusId || null,
ToStatusId:  formValues.ToStatusId || null,
ReasonCode:  formValues.ReasonCode || null,
Remarks:  formValues.Remarks || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetStatusHistory ;
	
	this.spinner.show();  	   
    this.assetStatusHistoryService.update(this.assetStatusHistory.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetStatusHistory +  'Details Updated sucessfully.');
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
