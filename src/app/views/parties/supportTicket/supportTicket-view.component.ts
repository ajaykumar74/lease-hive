import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISupportTicket } from './supportTicket';
import { SupportTicketService } from './supportTicket.service';

@Component({ selector: 'app-support-ticket-view', standalone: false, templateUrl: './supportTicket-view.component.html' })
export class SupportTicketViewComponent implements OnInit {
    ticket?: ISupportTicket; error='';
    constructor(private readonly route:ActivatedRoute,private readonly router:Router,private readonly service:SupportTicketService){}
    ngOnInit():void{const id=Number(this.route.snapshot.paramMap.get('id'));this.service.getById(id).subscribe({next:ticket=>this.ticket=ticket,error:()=>this.error='Unable to load the support ticket.'});}
    changed(ticket:ISupportTicket):void{this.ticket=ticket;} back():void{this.router.navigate(['/business/support/tickets']);}
}
