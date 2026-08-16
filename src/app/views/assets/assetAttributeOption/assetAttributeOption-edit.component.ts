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
import { IAssetAttributeOption } from './assetAttributeOption';
import { AssetAttributeOptionService } from './assetAttributeOption.service';


@Component({
  selector: 'app-assetAttributeOption-edit',
  standalone: false,
  templateUrl: './assetAttributeOption-edit.component.html',
  providers: [ MessageService]
})
export class AssetAttributeOptionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetAttributeOption: IAssetAttributeOption = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetattributedefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetAttributeOption = {} as IAssetAttributeOption;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetAttributeOptionService: AssetAttributeOptionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeOption };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetAttributeDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OptionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OptionLabel: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
SortOrder: new FormControl(0, [Validators.required, ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

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
    this.assetAttributeOptionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetAttributeOption = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetAttributeOption };
        this.populateUI(this.assetAttributeOption);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetAttributeOption): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
OptionCode: obj.OptionCode || '',
OptionLabel: obj.OptionLabel || '',
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetAttributeOption Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeOption/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetAttributeOption = { ...this.objMaster };
	var obj  = this.assetAttributeOption;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
OptionCode: obj.OptionCode || '',
OptionLabel: obj.OptionLabel || '',
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
     AssetAttributeDefinitionId:  formValues.AssetAttributeDefinitionId || null,
OptionCode:  formValues.OptionCode || null,
OptionLabel:  formValues.OptionLabel || null,
SortOrder:  formValues.SortOrder || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetAttributeOption ;
	
	this.spinner.show();  	   
    this.assetAttributeOptionService.update(this.assetAttributeOption.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetAttributeOption +  'Details Updated sucessfully.');
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
