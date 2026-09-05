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
import { IEndOfLeaseOption } from './endOfLeaseOption';
import { EndOfLeaseOptionService } from './endOfLeaseOption.service';


@Component({
  selector: 'app-endOfLeaseOption-edit',
  standalone: false,
  templateUrl: './endOfLeaseOption-edit.component.html',
  providers: [ MessageService]
})
export class EndOfLeaseOptionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  endOfLeaseOption: IEndOfLeaseOption = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
optioncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEndOfLeaseOption = {} as IEndOfLeaseOption;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private endOfLeaseOptionService: EndOfLeaseOptionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseOption };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OptionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OfferedDate: new FormControl(new Date(), [Validators.required]),
OptionExpiryDate: new FormControl(new Date(), []),
ReferenceAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
SelectedFlag: new FormControl(false, [Validators.required]),
SelectedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.optioncodeOptions = this.loggedInUserService.getPicklistOptions('OptionCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.endOfLeaseOptionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.endOfLeaseOption = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.endOfLeaseOption };
        this.populateUI(this.endOfLeaseOption);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEndOfLeaseOption): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
OptionCode: obj.OptionCode || '',
OfferedDate:  obj.OfferedDate || new Date(),
OptionExpiryDate:  obj.OptionExpiryDate || new Date(),
ReferenceAmount: obj.ReferenceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectedFlag:  obj.SelectedFlag || false,
SelectedAt:  obj.SelectedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "EndOfLeaseOption Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/options/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.endOfLeaseOption = { ...this.objMaster };
	var obj  = this.endOfLeaseOption;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
OptionCode: obj.OptionCode || '',
OfferedDate:  obj.OfferedDate || new Date(),
OptionExpiryDate:  obj.OptionExpiryDate || new Date(),
ReferenceAmount: obj.ReferenceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectedFlag:  obj.SelectedFlag || false,
SelectedAt:  obj.SelectedAt || new Date(),
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
     EndOfLeaseCaseId:  formValues.EndOfLeaseCaseId || null,
OptionCode:  formValues.OptionCode || null,
OfferedDate:  formValues.OfferedDate || null,
OptionExpiryDate:  formValues.OptionExpiryDate || null,
ReferenceAmount:  formValues.ReferenceAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
SelectedFlag:  formValues.SelectedFlag || null,
SelectedAt:  formValues.SelectedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IEndOfLeaseOption ;
	
	this.spinner.show();  	   
    this.endOfLeaseOptionService.update(this.endOfLeaseOption.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EndOfLeaseOption +  'Details Updated sucessfully.');
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
