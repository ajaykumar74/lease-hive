import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPortalUser } from './portalUser';
import { PortalUserService } from './portalUser.service';
import { PickListService } from '@/shared/PicklistService';
import { AppConstants } from '@/shared/constants/AppConstants';
import { emailDomainValidator } from '@/shared/minimumAgeValidator';

@Component({
  selector: 'app-portalUser-create',
  standalone: false,
  templateUrl: './portalUser-create.component.html',
  providers: [MessageService]
})
export class PortalUserCreateComponent implements OnInit {

  pickListServiceOptions: any;
  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  portalUser: IPortalUser = null;
  departmentOptions: ISelectItem[] = [];
  roleOptions: ISelectItem[] = [];
  editForm: any;
  objMaster: IPortalUser = {} as IPortalUser;
  isShowRolePermissions: boolean = false;
  isCustomer: boolean = false;



  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private portalUserService: PortalUserService,
    private loggedInUserService: LoggedInUserService,
    private pickListService: PickListService,
    readonly appConstants: AppConstants,

  ) {
  }
  allowedDomain: string;
  ngOnInit(): void {
    this.pickListServiceOptions = this.pickListService;
    this.objMaster = { ...this.portalUser };
    var emailId;
    if (this.loggedInUserService.loggedInUser.AccountType == 'Customer') {
      emailId = this.loggedInUserService.loggedInUser.Customer.EmailId;
      this.isCustomer = true;
    }
    else {
      emailId = this.loggedInUserService.loggedInUser.BrandPartner.EmailId;
    }
    this.allowedDomain = emailId.split('@')[1].trim().toLowerCase()

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Code: new FormControl('', [Validators.maxLength(20)]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(35),  Validators.pattern('^(?! )[A-Za-z ]*(?<! )$')]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      EmailId: new FormControl('', [Validators.required, Validators.maxLength(254), Validators.email, emailDomainValidator(this.allowedDomain),]),
      Mobile: new FormControl('', [Validators.required,Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],),
      Department: new FormControl('', [Validators.maxLength(25),]),
      Role: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(255),]),

    });
    this.departmentOptions.push({ Text: '', Value: '' });

    if (this.loggedInUserService.loggedInUser.AccountType == 'Customer') {
      this.roleOptions.push({ Text: 'MemberOwner', Value: 'MemberOwner' });
      this.roleOptions.push({ Text: 'MemberAdmin', Value: 'MemberAdmin' });
      this.roleOptions.push({ Text: 'MemberUser', Value: 'MemberUser' });

      this.editForm.patchValue(
        {
          Role: this.appConstants.Role.MemberAdmin,
          Department: this.appConstants.Department.Admin,
        }
      );

    }
    else {
      this.roleOptions.push({ Text: 'PartnerOwner', Value: 'PartnerOwner' });
      this.roleOptions.push({ Text: 'PartnerAdmin', Value: 'PartnerAdmin' });
      this.roleOptions.push({ Text: 'PartnerUser', Value: 'PartnerUser' });

      this.editForm.patchValue(
        {
          Role: this.appConstants.Role.PartnerAdmin,
          Department: this.appConstants.Department.Admin,
        }
      );
    }
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Caption = "Create User";
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.portalUserService.getById(this.selectedId).subscribe({
      next: data => {
        this.portalUser = data;
        this.objMaster = { ...this.portalUser };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IPortalUser): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Code: obj.Code || '',
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Department: obj.Department || '',
        Role: obj.Role || '',
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/portalUsers/create']);
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
    this.portalUser = { ...this.objMaster };
    var obj = this.portalUser;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Code: obj.Code || '',
        FirstName: obj.FirstName || '',
        LastName: obj.LastName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        Department: obj.Department || '',
        Role: obj.Role || '',
        Description: obj.Description || ''

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
      Id: 0,
      RecordById: this.loggedInUserService.getRecordId,
      RecordByType: this.loggedInUserService.getRecordType,
      Code: formValues.Code || null,
      FirstName: formValues.FirstName || null,
      LastName: formValues.LastName || null,
      EmailId: formValues.EmailId || null,
      Mobile: formValues.Mobile || null,
      Department: formValues.Department || null,
      Role: formValues.Role || null,
      Description: formValues.Description || null,

    } as IPortalUser;



    this.spinner.show();
    this.portalUserService.create(createdObj).subscribe({
      next: data => {
        this.portalUserService.CacheData.IsLoaded = false;
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }

  onFirstNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase();
    //this.editForm.get('FirstName')?.setValue(upper, { emitEvent: false });
  }

}



