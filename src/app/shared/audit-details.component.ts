import { Component,  Input, OnInit } from '@angular/core';
 


@Component({
  standalone:false,
  selector: 'app-audit-details',
  templateUrl: './audit-details.component.html',
  styleUrls: ['./audit-details.component.css']
})
export class AuditDetailsComponent implements OnInit {
 
  constructor() { }
  
   @Input() model: any;
  
    ngOnInit(): void {

    }
  
}
