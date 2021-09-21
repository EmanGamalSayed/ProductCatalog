import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { ProductService } from '../services/app-service';

interface HttpProgressEvent {
  type: HttpEventType.DownloadProgress | HttpEventType.UploadProgress
  loaded: number
  total: number
}

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})

export class UploadImageComponent implements OnInit {
  public photos: string[] = [];
  imageUrl : string = "assets/img/default_product.png";
  progress: number;
  message: string;
  @Output() onUploadFinished = new EventEmitter();
  fileToUpload: File;
  private _retrySrc: string;
  private _timer;
  constructor(
    private productService: ProductService,
    private http: HttpClient) {
   }
  
  ngOnInit() {
  }
  
  handleFileInput (event){
    this.fileToUpload = <File>event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }

  event: HttpProgressEvent = { type: 0, loaded: 0, total: 0 };
  uploadFile = () => {
    
    //let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http.post(this.productService.apiUrl +'/UploadImage', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          this.progress = Math.round(100 * this.event.loaded / this.event.total);
          console.log("Progress" + this.progress);
        }
        
        else if(event.type === HttpEventType.Response) {
          //this.message = 'Upload success.';
          console.log("'Upload success.'");
          this.onUploadFinished.emit(event.body);
        }
      });
  }

  

}
