import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';  
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';  
import { MatDialog } from '@angular/material/dialog';  
import { MatTableDataSource, } from '@angular/material/table';  
import { MatPaginator } from '@angular/material/paginator';  
import { MatSort } from '@angular/material/sort';  
import { SelectionModel } from '@angular/cdk/collections';  
import { ProductService } from '../services/product.service';
import { Guid } from 'guid-typescript';
import { Product } from '../models/product.model';
import { getLocaleDateTimeFormat } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;


  dataSaved = false;  
  productForm: any;  
  allProducts: Observable<Product[]>;  
  dataSource: MatTableDataSource<Product>;  
  selection = new SelectionModel<Product>(true, []);  
  massage = null;  
  SelectedDate = null;  
  idUpdate: Guid = Guid.createEmpty();
  isCreate: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';  
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';  
  displayedColumns: string[] = ['photo', 'name', 'price', 'lastUpdate', 'Edit', 'Delete'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort;  
  fileToUpload: File;
  imageUrl : string = "assets/img/default_product.png";
  photoUrlToUpload : any;

  constructor(private formbulider: FormBuilder, 
    private productService: ProductService, 
    private _snackBar: MatSnackBar, 
    public dialog: MatDialog,
    private http: HttpClient) {  
    this.productService.getAllProducts().subscribe(data => {  
      this.dataSource = new MatTableDataSource(data);  
      this.dataSource.paginator = this.paginator;  
      this.dataSource.sort = this.sort;  
    });  
  }  
   
  ngOnInit() {  
    this.productForm = this.formbulider.group({  
      name: ['', [Validators.required]],  
      price: ['', [Validators.required]],  
      photo: [''],
    });  
    this.loadAllProducts();  
    this.dataSource = new MatTableDataSource(this.productForm );  
    this.dataSource.paginator = this.paginator;  
    this.dataSource.sort = this.sort;  
    this.imageUrl = "assets/img/default_product.png";
  }  
  
  applyFilter(event: Event) { 
    const input = (event.target as HTMLInputElement).value; 
    this.dataSource.filter = input.trim().toLowerCase();  
   
    if (this.dataSource.paginator) {  
      this.dataSource.paginator.firstPage();  
    }  
  }  
   
  loadAllProducts() {  
    this.productService.getAllProducts().subscribe(data => {  
      this.dataSource = new MatTableDataSource(data);  
      this.dataSource.paginator = this.paginator;  
      this.dataSource.sort = this.sort;  
    });  
  }  
  onFormSubmit() {  

    this.dataSaved = false;  
    const productForm = this.productForm.value;  
    this.CreateProduct(productForm);  
    this.productForm.reset();  
  }  
  loadProductToEdit(id: Guid) {  
    console.log("testttt");
    
    this.productService.getProductById(id).subscribe(p => {  
      this.isCreate = false;
      this.massage = null;  
      this.dataSaved = false;  
      this.idUpdate = p.id;  
      this.productForm.controls['name'].setValue(p.name);  
      this.productForm.controls['price'].setValue(p.price);  
      // this.productForm.controls['photo'].setValue(p.photo);
      this.productForm.value.photo = p.photo;
      console.log(p,"222");
    
      this.imageUrl="assets/img/default_product.png";
      (p.photo == null ? this.imageUrl : this.imageUrl = p.photo)
      console.log("imgPath=> ",p.photo);
      
    });  
   
  }  
  
  CreateProduct(product: Product) {  
    if (product.photo != null)
      product.photo = this.productService.localHostUrl +"/"+ product.photo;
    if (this.idUpdate.toString() == Guid.EMPTY) {  
      this.productService.addProduct(product).subscribe(  
        () => {  
          this.dataSaved = true;  
          this.SavedSuccessful(1);  
          this.loadAllProducts();  
          this.idUpdate = Guid.createEmpty();  
          this.productForm.reset();  
          this.imageUrl = "assets/img/default_product.png";
        }  
      );  
    } else {  
      product.id = this.idUpdate;   
      this.productService.updateProduct(product.id, product).subscribe(() => {  
        this.dataSaved = true;  
        this.SavedSuccessful(0);  
        this.loadAllProducts();  
        this.idUpdate = Guid.createEmpty();  
        this.productForm.reset();  
        this.imageUrl = "assets/img/default_product.png";
      });  
    }  
  }  
  deleteProduct(id: Guid) {  
    if (confirm("Are you sure you want to delete this ?")) {  
      this.productService.deleteProduct(id).subscribe(() => {  
        this.dataSaved = true;  
        this.SavedSuccessful(2);  
        this.loadAllProducts();  
        this.idUpdate = Guid.createEmpty();  
        this.productForm.reset();  
   
      });  
    }  
   
  }  

   
  resetForm() {  
    this.productForm.reset();  
    this.massage = null;  
    this.dataSaved = false; 
    this.loadAllProducts();  
  }  
   
  SavedSuccessful(isUpdate) {  
    if (isUpdate == 0) {  
      this._snackBar.open('Record Updated Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
    else if (isUpdate == 1) {  
      this._snackBar.open('Record Saved Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
    else if (isUpdate == 2) {  
      this._snackBar.open('Record Deleted Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
  }  

  handleFileInput (event){
    this.fileToUpload = <File>event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }

  uploadFile = () => {

    //let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.http.post(this.productService.apiUrl +'/UploadImage', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          console.log("Progress...");
        }
        
        else if(event.type === HttpEventType.Response) {
          console.log("'Upload success.'");
          this.photoUrlToUpload = event.body;
          this.productForm.value.photo = this.photoUrlToUpload.dbPath;
          
        }
      });
  }
  exportAsExcel(){
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'productCatalog');

    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
}  


