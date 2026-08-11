import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { Component, OnInit } from '@angular/core';
  

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: 'dashboardAdmin-component.html',
  styleUrl: 'dashboardAdmin-component.css',
})


export class AdminDashboardComponent implements OnInit {
 
  constructor(     
    private loggedInUserService: LoggedInUserService
  ) {
  }


  ngOnInit(): void {
    /* this.driverService.getById(this.selectedId).subscribe({
      next: data => {
        
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); */
  }

}

