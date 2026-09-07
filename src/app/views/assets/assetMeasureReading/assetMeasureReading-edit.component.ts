import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetMeasureReading } from './assetMeasureReading';
import { AssetMeasureReadingService } from './assetMeasureReading.service';


@Component({
  selector: 'app-assetMeasureReading-edit',
  standalone: false,
  templateUrl: './assetMeasureReading-edit.component.html',
  providers: [ MessageService]
})
export class AssetMeasureReadingEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetMeasureReading: IAssetMeasureReading = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
assetmeasuredefinitionidOptions: ISelectItem[] = [];
readingsourceidOptions: ISelectItem[] = [];
recordedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetMeasureReading = {} as IAssetMeasureReading;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetMeasureReadingService: AssetMeasureReadingService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetMeasureReading };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetMeasureDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReadingValue: new FormControl(0, [Validators.required]),
ReadingDateTime: new FormControl(new Date(), [Validators.required]),
ReadingSourceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SourceReference: new FormControl('', [Validators.maxLength(120), ]), 
IsVerified: new FormControl(false, [Validators.required]),
RecordedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetMeasureDefinitionId', 'asset-measure-definitions', options => this.assetmeasuredefinitionidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReadingSourceId', 'asset-reading-sources', options => this.readingsourceidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'RecordedBy', 'application-users', options => this.recordedbyOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetMeasureReadingService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetMeasureReading = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetMeasureReading };
        this.populateUI(this.assetMeasureReading);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetMeasureReading): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetMeasureDefinitionId: obj.AssetMeasureDefinitionId || 0,
ReadingValue: obj.ReadingValue || 0,
ReadingDateTime:  obj.ReadingDateTime || new Date(),
ReadingSourceId: obj.ReadingSourceId || 0,
SourceReference: obj.SourceReference || '',
IsVerified:  obj.IsVerified || false,
RecordedBy: obj.RecordedBy || 0,
 
      }
    );
   
	 this.Caption = "AssetMeasureReading Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMeasureReading/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetMeasureReading = { ...this.objMaster };
	var obj  = this.assetMeasureReading;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetMeasureDefinitionId: obj.AssetMeasureDefinitionId || 0,
ReadingValue: obj.ReadingValue || 0,
ReadingDateTime:  obj.ReadingDateTime || new Date(),
ReadingSourceId: obj.ReadingSourceId || 0,
SourceReference: obj.SourceReference || '',
IsVerified:  obj.IsVerified || false,
RecordedBy: obj.RecordedBy || 0,
 
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
AssetMeasureDefinitionId:  formValues.AssetMeasureDefinitionId || null,
ReadingValue:  formValues.ReadingValue || null,
ReadingDateTime:  formValues.ReadingDateTime || null,
ReadingSourceId:  formValues.ReadingSourceId || null,
SourceReference:  formValues.SourceReference || null,
IsVerified:  formValues.IsVerified || null,
RecordedBy:  formValues.RecordedBy || null,

    } as IAssetMeasureReading ;
	
	this.spinner.show();  	   
    this.assetMeasureReadingService.update(this.assetMeasureReading.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetMeasureReading +  'Details Updated sucessfully.');
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
