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
import { IAssetDocumentLink } from './assetDocumentLink';
import { AssetDocumentLinkService } from './assetDocumentLink.service';


@Component({
  selector: 'app-assetDocumentLink-edit',
  standalone: false,
  templateUrl: './assetDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class AssetDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetDocumentLink: IAssetDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentpurposeidOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetDocumentLink = {} as IAssetDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetDocumentLinkService: AssetDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IsPrimary: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
IsVerified: new FormControl(false, [Validators.required]),
VerifiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentpurposeidOptions.push({Text: 'DocumentPurposeId1', Value: 'DocumentPurposeId1' });
this.documentpurposeidOptions.push({Text: 'DocumentPurposeId2', Value: 'DocumentPurposeId2' });
this.verifiedbyOptions.push({Text: 'VerifiedBy1', Value: 'VerifiedBy1' });
this.verifiedbyOptions.push({Text: 'VerifiedBy2', Value: 'VerifiedBy2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetDocumentLink };
        this.populateUI(this.assetDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeId: obj.DocumentPurposeId || 0,
IsPrimary:  obj.IsPrimary || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsVerified:  obj.IsVerified || false,
VerifiedBy: obj.VerifiedBy || 0,
 
      }
    );
   
	 this.Caption = "AssetDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetDocumentLink/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetDocumentLink = { ...this.objMaster };
	var obj  = this.assetDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeId: obj.DocumentPurposeId || 0,
IsPrimary:  obj.IsPrimary || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
IsVerified:  obj.IsVerified || false,
VerifiedBy: obj.VerifiedBy || 0,
 
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
DocumentId:  formValues.DocumentId || null,
DocumentPurposeId:  formValues.DocumentPurposeId || null,
IsPrimary:  formValues.IsPrimary || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
IsVerified:  formValues.IsVerified || null,
VerifiedBy:  formValues.VerifiedBy || null,

    } as IAssetDocumentLink ;
	
	this.spinner.show();  	   
    this.assetDocumentLinkService.update(this.assetDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetDocumentLink +  'Details Updated sucessfully.');
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
