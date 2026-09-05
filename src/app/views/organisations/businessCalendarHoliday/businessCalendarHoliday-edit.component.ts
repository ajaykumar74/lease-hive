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
import { IBusinessCalendarHoliday } from './businessCalendarHoliday';
import { BusinessCalendarHolidayService } from './businessCalendarHoliday.service';


@Component({
  selector: 'app-businessCalendarHoliday-edit',
  standalone: false,
  templateUrl: './businessCalendarHoliday-edit.component.html',
  providers: [ MessageService]
})
export class BusinessCalendarHolidayEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  businessCalendarHoliday: IBusinessCalendarHoliday = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  daytypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBusinessCalendarHoliday = {} as IBusinessCalendarHoliday;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private businessCalendarHolidayService: BusinessCalendarHolidayService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.businessCalendarHoliday };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BusinessCalendarId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
HolidayDate: new FormControl(new Date(), [Validators.required]),
HolidayName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
DayCounts: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DayType: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
StartTime: new FormControl('', [Validators.maxLength(5), ]), 
EndTime: new FormControl('', [Validators.maxLength(5), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Description: new FormControl('', [Validators.maxLength(100), ]), 

    });
this.daytypeOptions = this.loggedInUserService.getPicklistOptions('DayType');
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
    this.businessCalendarHolidayService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.businessCalendarHoliday = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.businessCalendarHoliday };
        this.populateUI(this.businessCalendarHoliday);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IBusinessCalendarHoliday): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BusinessCalendarId: obj.BusinessCalendarId || 0,
HolidayDate:  obj.HolidayDate || new Date(),
HolidayName: obj.HolidayName || '',
DayCounts: obj.DayCounts || 0,
DayType: obj.DayType || '',
StartTime: obj.StartTime || '',
EndTime: obj.EndTime || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "BusinessCalendarHoliday Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/calendars/holidays/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.businessCalendarHoliday = { ...this.objMaster };
	var obj  = this.businessCalendarHoliday;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BusinessCalendarId: obj.BusinessCalendarId || 0,
HolidayDate:  obj.HolidayDate || new Date(),
HolidayName: obj.HolidayName || '',
DayCounts: obj.DayCounts || 0,
DayType: obj.DayType || '',
StartTime: obj.StartTime || '',
EndTime: obj.EndTime || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Description: obj.Description || '',
 
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
     BusinessCalendarId:  formValues.BusinessCalendarId || null,
HolidayDate:  formValues.HolidayDate || null,
HolidayName:  formValues.HolidayName || null,
DayCounts:  formValues.DayCounts || null,
DayType:  formValues.DayType || null,
StartTime:  formValues.StartTime || null,
EndTime:  formValues.EndTime || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Description:  formValues.Description || null,

    } as IBusinessCalendarHoliday ;
	
	this.spinner.show();  	   
    this.businessCalendarHolidayService.update(this.businessCalendarHoliday.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BusinessCalendarHoliday +  'Details Updated sucessfully.');
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
