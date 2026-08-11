import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'portalUser-rolePermission',
  standalone: false,
  templateUrl: './portalUser-rolePermission.component.html',
  providers: [],
})
export class PortalUserRolePermission implements OnInit {
  @Input() standaloneMode: boolean = true;

  editForm: any;
  pickListServiceOptions: any;
  Caption: string = 'Update Vehicle Usage #';
  constructor(

  ) { }

  ngOnInit(): void {
  }

}