import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../service/admin-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {



  constructor(
    private service: AdminServiceService,
    private db: AngularFirestore,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    fileToUpload: File;


    productForm = this.fb.group({
      productName: ['', Validators.required],
      productPrice: ['', Validators.required],
      productQuantity: ['', Validators.required],
      productStatus: ['', Validators.required],
      productThumbnail: ['', Validators.required],
    });

  
    onSubmit(type) {
      console.log(type);
      const name = this.productForm.get('productName').value;
      const price = this.productForm.get('productPrice').value;
      const thumbnail = this.productForm.get('productThumbnail').value;
      const quantity = this.productForm.get('productQuantity').value;
      const status = this.productForm.get('productStatus').value;
      if(type == 'Create') {
        console.warn(this.productForm.value);
        this.service.createProductList(name, price, thumbnail, quantity, status).subscribe(res => {
          console.log(res);
          if (res) {
            alert('create success');
            location.reload();
          }
        })
      } else if(type == 'Edit') {
        this.service.editProduct(this.data.id, name, price, thumbnail, quantity, status).subscribe(res => {
          console.log(res);
          alert('edit success');
          location.reload();
          if (res) {
          }
        })
      }
      else {
        this.service.deleteProduct(this.data.id).subscribe(res => {
          console.log('res delete', res);
          alert('delete success');
          location.reload();
        })
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.data.type == 'Edit') {
      console.log('a', this.data)
      this.productForm.get('productName').setValue(this.data.name);
      this.productForm.get('productPrice').setValue(this.data.price);
      this.productForm.get('productThumbnail').setValue(this.data.thumbnail);
      this.productForm.get('productQuantity').setValue(this.data.quantity);
      this.productForm.get('productStatus').setValue(this.data.status);

    }
    console.log(this.db);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload, this.fileToUpload.name);
}

  create() {
    const uploadImage = new FormData();
    uploadImage.append('image', this.fileToUpload);
    uploadImage.append('name', this.fileToUpload.name);
    // this.service.uploadImage(uploadImage, this.fileToUpload.name)).subscribe(res => {
    //   console.log(res);
    // })

    alert('a');
    this.dialogRef.close();

  }

}
