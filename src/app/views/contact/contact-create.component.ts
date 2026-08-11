import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { IStateData, LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IContact } from './contact';
import { ContactService } from './contact.service';


@Component({
  selector: 'app-contact-create',
  standalone: false,
  templateUrl: './contact-create.component.html',
  providers: [MessageService]
})
export class ContactCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = { CanCreate: true } as IPermission;
  Caption: string = 'Loading...';
  contact: IContact = null;
  designationOptions: ISelectItem[] = [];
  departmentOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IContact = {} as IContact;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private contactService: ContactService,
    private loggedInUserService: LoggedInUserService

  ) {
  }

  stateData: IStateData;
  designationList: any[] = [];
  departmentList: any[] = [];

  ngOnInit(): void {

    var nState = this.router.lastSuccessfulNavigation?.extras.state;
    this.stateData = nState['stateData'] as IStateData;
    this.Caption = this.stateData.Name + ' Contacts'
    this.designationList.push({ text: 'Managing Director', value: 'ManagingDirector' },
      { text: 'Project Manager', value: 'ProjectManager' },
      { text: 'Chartered Accountant', value: 'CharteredAccountant' },
      { text: 'Legal Advisor', value: 'LegalAdvisor' },
      { text: 'Office Manager', value: 'OfficeManager' },
      { text: 'Sales Executive', value: 'SalesExecutive' },
      { text: 'Recruitment Consultant', value: 'RecruitmentConsultant' },
      { text: 'UX Designer', value: 'UXDesigner' },
      { text: 'Intern', value: 'Intern' },
      { text: 'Other', value: 'Other' });
    this.departmentList.push({ text: 'Human Resources', value: 'HR' },
      { text: 'Finance', value: 'FIN' },
      { text: 'Marketing', value: 'MKT' },
      { text: 'Sales', value: 'SALES' },
      { text: 'Information Technology', value: 'IT' },
      { text: 'Customer Service', value: 'CS' },
      { text: 'Operations', value: 'OPS' },
      { text: 'Quality Assurance', value: 'QA' },
      { text: 'Research & Development', value: 'RD' },
      { text: 'Other', value: 'Other' });

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      EmailId: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)]),
      Mobile: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],),
      Designation: new FormControl('', [Validators.maxLength(20),]),
      Department: new FormControl('', [Validators.maxLength(20),]),
      IsConfidential: new FormControl(false),

    });
    this.designationOptions.push({ Text: '', Value: '' });
    this.departmentOptions.push({ Text: '', Value: '' });

  }

  loadUI(): void {
    this.isLoading = true;
    this.contactService.getById(this.selectedId).subscribe({
      next: data => {
        this.contact = data;
        this.objMaster = { ...this.contact };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IContact): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Designation: obj.Designation || '',
        Department: obj.Department || '',
        IsConfidential: obj.IsConfidential || false,


      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contacts/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.contact = { ...this.objMaster };
    var obj = this.contact;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Designation: obj.Designation || '',
        Department: obj.Department || '',
        IsConfidential: obj.IsConfidential || false,

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
    var createdObj = {
      Id: this.objMaster.Id,
      RecordById: this.loggedInUserService.getRecordId,
      RecordByType: this.loggedInUserService.getRecordType,
      RowVersionStr: this.objMaster.RowVersionStr,
      FirstName: formValues.FirstName || null,
      LastName: formValues.LastName || null,
      EmailId: formValues.EmailId || null,
      Mobile: formValues.Mobile || null,
      Designation: formValues.Designation || null,
      Department: formValues.Department || null,
      IsConfidential: formValues.IsConfidential || false,

    } as IContact;

    this.spinner.show();
    this.contactService.create(createdObj).subscribe({
      next: data => {
        this.contactService.CacheData.IsLoaded = false;
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }

}



