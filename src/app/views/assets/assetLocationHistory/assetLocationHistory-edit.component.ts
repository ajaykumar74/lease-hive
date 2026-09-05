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
import { IAssetLocationHistory } from './assetLocationHistory';
import { AssetLocationHistoryService } from './assetLocationHistory.service';


@Component({
  selector: 'app-assetLocationHistory-edit',
  standalone: false,
  templateUrl: './assetLocationHistory-edit.component.html',
  providers: [ MessageService]
})
export class AssetLocationHistoryEditComponent implements OnInit {

  selectedId: number;
  assetId: number | null = null;
  isLoading: boolean = false;
  assetLocationHistory: IAssetLocationHistory = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
fromlocationidOptions: ISelectItem[] = [];
tolocationidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
movementtypeOptions: ISelectItem[] = [];
referencetypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetLocationHistory = {} as IAssetLocationHistory;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetLocationHistoryService: AssetLocationHistoryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetLocationHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
FromLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MovementType: new FormControl('', [Validators.maxLength(20), ]), 
MovementDateTime: new FormControl(new Date(), []),
ReferenceType: new FormControl('', [Validators.maxLength(20), ]), 
ReferenceId: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetidOptions.push({Text: 'Asset1', Value: 'Asset1' });
this.assetidOptions.push({Text: 'Asset2', Value: 'Asset2' });
this.fromlocationidOptions.push({Text: 'Location1', Value: 'Location1' });
this.fromlocationidOptions.push({Text: 'Location2', Value: 'Location2' });
this.tolocationidOptions.push({Text: 'Location1', Value: 'Location1' });
this.tolocationidOptions.push({Text: 'Location2', Value: 'Location2' });
this.partylocationidOptions.push({Text: 'PartyLoca1', Value: 'PartyLoca1' });
this.partylocationidOptions.push({Text: 'PartyLoc2', Value: 'PartyLoc2' });
this.movementtypeOptions = this.loggedInUserService.getPicklistOptions('MovementType');
this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('AssetLocationHistoryReferenceType');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
     this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetId) this.editForm.controls.AssetId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetLocationHistoryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetLocationHistory = data.data;
		if (this.assetId && this.assetLocationHistory.AssetId !== this.assetId) {
		  this.messageService.showError('This record does not belong to the selected asset.');
		  this.router.navigate(['/dashboard/assetLocationHistorys/asset', this.assetId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.assetLocationHistory };
        this.populateUI(this.assetLocationHistory);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetLocationHistory): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
FromLocationId: obj.FromLocationId || 0,
ToLocationId: obj.ToLocationId || 0,
PartyLocationId: obj.PartyLocationId || 0,
MovementType: obj.MovementType || '',
MovementDateTime:  obj.MovementDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetLocationHistory Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetLocationHistory/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetLocationHistory = { ...this.objMaster };
	var obj  = this.assetLocationHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
FromLocationId: obj.FromLocationId || 0,
ToLocationId: obj.ToLocationId || 0,
PartyLocationId: obj.PartyLocationId || 0,
MovementType: obj.MovementType || '',
MovementDateTime:  obj.MovementDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
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
     AssetId:  this.assetId ?? formValues.AssetId ?? this.objMaster.AssetId,
FromLocationId:  formValues.FromLocationId || null,
ToLocationId:  formValues.ToLocationId || null,
PartyLocationId:  formValues.PartyLocationId || null,
MovementType:  formValues.MovementType || null,
MovementDateTime:  formValues.MovementDateTime || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetLocationHistory ;
	
	this.spinner.show();  	   
    this.assetLocationHistoryService.update(this.assetLocationHistory.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetLocationHistory +  'Details Updated sucessfully.');
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
