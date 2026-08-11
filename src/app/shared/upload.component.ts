import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http'; 
import { catchError, map, tap } from 'rxjs/operators'; 
 import { environment } from '../../environments/environment';
import { LoggedInUserService } from './LoggedInUserService';
import { BaseService } from './IBaseService';

@Component({
  selector: 'app-upload',
  standalone: false,
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  public progress: number;
  public message: string;
  public filenames: string[] = [];
  @Output() public onUploadFinished = new EventEmitter();
  @Output() public onFileError = new EventEmitter();
  @Input() RecordById;
  @Input() RecordByType;
  @Input() DocumentType;
  @Input() public IsUploadAllowed: boolean = true;
  @Input() UploadType: 'Document'; //Document - Upload and and create a document , TempFile- upload only a file in temp folder 

  constructor(
    private http: HttpClient,
    private loggedInUserService: LoggedInUserService, 
    private baseService: BaseService
  ) { }

  ngOnInit() {
  }

  public uploadFileSingle = (files) => {
    debugger;
    this.message= '';
    this.filenames = []; 
    if (files.length === 0) {
      return;
    }
    else if (this.IsUploadAllowed == false) {    
      this.onFileError.emit("Upload is not allowed for system generated documents.");
      return;
    }

    let fileToUpload = <File>files[0];
    const size  = fileToUpload.size/1024;
    if (size> 1024) {
      this.onFileError.emit("File size exceeds allowed upload size of 1MB.");
      return ;
    }
    
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    const token = localStorage.getItem("jwt");
    const myheaders = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    var url = '';

    if (this.UploadType == 'Document') {
      //Upload and and create a document 
        url = `/File/UploadTempFile`;
      //url = `/File/UploadTempFile?path=${this.loggedInUserService.loggedInUser.Username}&recId=${this.RecordById}&type=${this.RecordByType}&doctype=${this.DocumentType}`;
    }
    else {
      //upload only a file in temp folder      
      url = `/File/UploadTempFile`;
    }

    this.http.post(this.baseService.C_APP_URL + url, formData, { headers: myheaders, reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          if (environment.envName == 'dev') {
            this.onTapData(event.body)  ;  
           }
          this.filenames.push(fileToUpload.name);          
          this.onUploadFinished.emit(event.body);
        }
      });
  }



  public uploadFile = (files) => {
    this.message= '';
    this.filenames = []; 
    if (files.length === 0) {
      return;
    }
    else if (this.IsUploadAllowed == false) {    
      this.onFileError.emit("Upload is not allowed for system generated documents.");
      return;
    }
    let filesToUpload: File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      var size  = file.size/1024;
      if (size> 1024) {
        this.onFileError.emit("one or more file size exceeds allowed upload size of 1MB.");
        return ;
      }
      this.filenames.push(file.name);
      return formData.append('file' + index, file, file.name);
    });
    const headers = this.baseService.getHeaders();
    var url = `/File/upload?path=${this.loggedInUserService.loggedInUser.Username}&recId=${this.RecordById}&Type=${this.RecordByType}&DocType=${this.DocumentType}`;
    
    this.http.post(this.baseService.C_APP_URL + url, formData, { headers: headers, reportProgress: true, observe: 'events' })
      .pipe(
        tap(data => this.onTapData(data)),
        catchError(
          this.baseService.handleError
        )
      )
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onTapData(event.body);
          this.onUploadFinished.emit(event.body);
        }
      }, (err) => {
        this.onFileError.emit("Error :" + err.error);
      });
  }

  onTapData(data: any) {
    if (environment.envName == 'dev') {
      console.log("response", data)
    }

  }
}
