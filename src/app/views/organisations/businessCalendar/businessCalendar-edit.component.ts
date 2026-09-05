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
import { IBusinessCalendar } from './businessCalendar';
import { BusinessCalendarService } from './businessCalendar.service';


@Component({
  selector: 'app-businessCalendar-edit',
  standalone: false,
  templateUrl: './businessCalendar-edit.component.html',
  providers: [ MessageService]
})
export class BusinessCalendarEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  businessCalendar: IBusinessCalendar = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  countrycodeOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
timezoneidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBusinessCalendar = {} as IBusinessCalendar;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private businessCalendarService: BusinessCalendarService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.businessCalendar };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CalendarCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CalendarName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
CountryCode: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
StateProvinceCode: new FormControl('', [Validators.required, Validators.maxLength(2), ]),
WeekendPattern: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
TimeZoneId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DayStartTime: new FormControl(new Date(), [Validators.required]),
DayEndTime: new FormControl(new Date(), [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.stateprovincecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.timezoneidOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
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
    this.businessCalendarService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.businessCalendar = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.businessCalendar };
        this.populateUI(this.businessCalendar);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IBusinessCalendar): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CalendarCode: obj.CalendarCode || '',
CalendarName: obj.CalendarName || '',
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
WeekendPattern: obj.WeekendPattern || '',
TimeZoneId: obj.TimeZoneId || '',
DayStartTime:  obj.DayStartTime || new Date(),
DayEndTime:  obj.DayEndTime || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "BusinessCalendar Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/calendars/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Holidays") {
      this.router.navigate(['/business/organisations/calendars/holidays', { id: this.businessCalendar.Id }]);
    }

  }





  onCancel(): void {
    this.businessCalendar = { ...this.objMaster };
	var obj  = this.businessCalendar;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CalendarCode: obj.CalendarCode || '',
CalendarName: obj.CalendarName || '',
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
WeekendPattern: obj.WeekendPattern || '',
TimeZoneId: obj.TimeZoneId || '',
DayStartTime:  obj.DayStartTime || new Date(),
DayEndTime:  obj.DayEndTime || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     CalendarCode:  formValues.CalendarCode || null,
CalendarName:  formValues.CalendarName || null,
CountryCode:  formValues.CountryCode || null,
StateProvinceCode:  formValues.StateProvinceCode || null,
WeekendPattern:  formValues.WeekendPattern || null,
TimeZoneId:  formValues.TimeZoneId || null,
DayStartTime:  formValues.DayStartTime || null,
DayEndTime:  formValues.DayEndTime || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IBusinessCalendar ;
	
	this.spinner.show();  	   
    this.businessCalendarService.update(this.businessCalendar.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BusinessCalendar +  'Details Updated sucessfully.');
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
