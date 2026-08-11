
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpResponse, HttpHeaderResponse } from '@angular/common/http';
import { BaseService } from './IBaseService';
import { LoggedInUserService } from './LoggedInUserService';



@Component({
  selector: 'app-download',
  standalone: false,
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  constructor(private http: HttpClient,
    private loggedInUserService: LoggedInUserService,
    private baseService: BaseService) { }

  public message: string;
  public progress: number;
  HasError: boolean;

@Input() public FileName: string;
@Input() public IsAllowRemove: boolean;
@Input() public RecordById: string;
@Input() public RecordByType: boolean;
@Input() public DocumentId: number;
@Input() public DownloadType: string; // Template or Document
@Input() public TemplateFilePath: string; // Template or Document
@Input() public ElementType: string = 'Link';  // Button or Link
@Output() public onFileError = new EventEmitter();

  downloadUrl: string;

  ngOnInit(): void {
  
  }

setUrl(){
   const baseUrl = this.baseService.C_APP_URL + '/File';
    if (this.DownloadType == 'Template') {
      this.downloadUrl = baseUrl + '/downloadTemplate?fileUrl=' + this.TemplateFilePath;
    }
    else if (this.DownloadType == 'DocumentByRecord') {
      this.FileName = this.FileName || 'Document';
      this.downloadUrl = baseUrl + '/DownloadByRecordIdAndType?RecordById=' + this.RecordById + '&RecordByType=' + this.RecordByType;
    }
    else if (this.DownloadType == 'Document') {
      this.FileName = this.FileName || 'Document';
      this.downloadUrl = baseUrl + '/DownloadAppFile?Id=' + this.DocumentId;
    }
}
  onDownloadClicked() {
    this.setUrl();
    this.downloadservice().subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round((100 * event.loaded) / event.total);
      else if (event.type === HttpEventType.Response) {
        this.message = 'Downloaded successfully.';
        this.downloadFile(event);
      }


      if (event instanceof HttpHeaderResponse) {
        if (event.status == 400 || event.status == 500) {
          this.onFileError.emit(event.status + " - Error downloading File.");
        }
      }

    }, (err) => {
      if (err.status == 404) {
        this.onFileError.emit("File not found.");
      }
      else {
        this.onFileError.emit("Error downloading file.");
      }
    });
  }

  private downloadservice() {
    const token = localStorage.getItem("jwt");
    const myheaders = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    var res = this.http.get(this.downloadUrl, {
      headers: myheaders,
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });

    return res;
  }


  private downloadFile(data: HttpResponse<Blob>) {
    console.log("download file:", data);
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = this.FileName;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  remove() {

  }



}
