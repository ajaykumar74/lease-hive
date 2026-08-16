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
import { IAssetAttributeValue } from './assetAttributeValue';
import { AssetAttributeValueService } from './assetAttributeValue.service';


@Component({
  selector: 'app-assetAttributeValue-edit',
  standalone: false,
  templateUrl: './assetAttributeValue-edit.component.html',
  providers: [ MessageService]
})
export class AssetAttributeValueEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetAttributeValue: IAssetAttributeValue = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
assetattributedefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetAttributeValue = {} as IAssetAttributeValue;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetAttributeValueService: AssetAttributeValueService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeValue };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetAttributeDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StringValue: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
DateValue: new FormControl(new Date(), []),
BooleanValue: new FormControl(false), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetidOptions.push({Text: '', Value: '' });
this.assetattributedefinitionidOptions.push({Text: '', Value: '' });
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
    this.assetAttributeValueService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetAttributeValue = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetAttributeValue };
        this.populateUI(this.assetAttributeValue);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetAttributeValue): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
StringValue: obj.StringValue || '',
DateValue:  obj.DateValue || new Date(),
BooleanValue:  obj.BooleanValue || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetAttributeValue Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeValue/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetAttributeValue = { ...this.objMaster };
	var obj  = this.assetAttributeValue;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
StringValue: obj.StringValue || '',
DateValue:  obj.DateValue || new Date(),
BooleanValue:  obj.BooleanValue || false,
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
     AssetId:  formValues.AssetId || null,
AssetAttributeDefinitionId:  formValues.AssetAttributeDefinitionId || null,
StringValue:  formValues.StringValue || null,
NumberValue:  formValues.NumberValue || null,
DateValue:  formValues.DateValue || null,
BooleanValue:  formValues.BooleanValue || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetAttributeValue ;
	
	this.spinner.show();  	   
    this.assetAttributeValueService.update(this.assetAttributeValue.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetAttributeValue +  'Details Updated sucessfully.');
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
