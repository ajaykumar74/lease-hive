  
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'; 
import { Table } from 'primeng/table';
import { IBrandPartner } from '../brandPartner/brandPartner';

@Component({
    selector: 'app-user',
    standalone: false, 
    templateUrl:  'user-component.html',
})
 

export class UserComponent implements OnInit {
    customers1: Customer[] = []; 
    
    statuses: any[] = []; 

    rowGroupMetadata: any; 

    activityValues: number[] = [0, 100]; 

    loading: boolean = false;

    @ViewChild('filter') filter!: ElementRef;
    loggedInUserService: any;

    constructor(
     
    ) {}
     brandPartner: IBrandPartner;
    ngOnInit() {
        this.brandPartner = this.loggedInUserService.loggedInUser.BrandPartner;
        for (let i = 0; i < 100; i++) {
            this.customers1.push({
                id: i,      
                name: 'User ' + i,
                email: 'someEmail' + i + '@example.com',
                company: 'Company ' + i,
                date: new Date(),
                status: 'qualified',
                activity: Math.floor(Math.random() * 1000) + 1
            });
        }
         

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

 
    

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    calculateCustomerTotal(name: string) {
        let total = 0;
 

        return total;
    }
 
}


export interface Customer {
    id?: number;
    name?: string;
    email?: string;
    company?: string;
    date?: Date;
    status?: string;
    activity?: number; 
}

