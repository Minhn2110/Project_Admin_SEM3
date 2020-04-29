import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminServiceService } from '../../service/admin-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  // const firebaseConfig = {
  //   apiKey: '<your-api-key>',
  //   authDomain: '<your-auth-domain>',
  //   databaseURL: '<your-database-url>',
  //   storageBucket: '<your-storage-bucket-url>'
  // };
  // firebase.initializeApp(firebaseConfig);

  // // Get a reference to the storage service, which is used to create references in your storage bucket
  // var storage = firebase.storage();

  constructor(
    private service: AdminServiceService,
    private db: AngularFirestore,
    public dialogRef: MatDialogRef<UserCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    fileToUpload: File;

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
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
