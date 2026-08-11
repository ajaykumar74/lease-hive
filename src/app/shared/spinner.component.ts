import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  standalone: false,
  styleUrl: './spinner.component.css'
})


export class SpinnerComponent implements OnInit {
  constructor(
  ) {
  }


  IsShowLoader: boolean;
  SpinnerMsg: string;
  ngOnInit(): void {

  }

  show(taskType: string = 'Save') {
    if (taskType == 'Fetch') {
      this.SpinnerMsg = "Fetching data...";
    }
    else if (taskType == 'Save') {
      this.SpinnerMsg = "Update data...";
    }
    else {
      this.SpinnerMsg = "Working. Please wait...";
    }
    this.IsShowLoader = true;
  }

  showLoadingMsg(msg) {
    this.SpinnerMsg = msg;
    this.IsShowLoader = true;
  }
  hide() {
    this.IsShowLoader = false;
  }

}
