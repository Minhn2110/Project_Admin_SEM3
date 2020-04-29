import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, retry } from 'rxjs/operators';
// import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  environment = 'https://api-demo-sem3.azurewebsites.net/api'

  constructor(private http: HttpClient,
    // private firebase: AngularFirestore
    ) { }
  createProductList(name, price, thumbnail, quantity, status): Observable<any> {
    const url = `${this.environment}/Products`;
    return this.http.request('POST', url, {
      body: {
        "Name": name,
        "Price": price,
        "Thumbnail": thumbnail,
        "CreateAt": "2019-03-11T09:18:54.092Z",
        "UpdateAt": "2019-04-11T09:18:54.092Z",
        "DeleteAt": "2019-04-11T09:18:54.092Z",
        "InStock": quantity,
        "Status": status
      }
    });

  };
  // <HttpResponse<any>>
  getProductList(keyword, sortType, sortBy, pageNumber, pageSize): Observable<any> {
    // let headers = new HttpHeaders();
    // headers = headers.append('Accept', 'text/plain')
    const url = `${this.environment}/Products?keyword=${keyword}&sortType=${sortType}&sortBy=${sortBy}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    // return this.http.request('GET', url, { headers: headers, observe: 'response'});
    return this.http.request('GET', url);
  }
  uploadImage(file, name): Observable<any> {
    var file = file;
    var metadata = {
      contentType: 'image/jpeg'
    };
    var uploadTask = firebase.storage().ref().child('dogImages/' + file.name).put(file, metadata);
    uploadTask.on('state_changed', function(snapshot){
  		// Observe state change events such as progress, pause, and resume
  		// See below for more detail
	}, function(error) {
  		// Handle unsuccessful uploads
	}, function() {
  		// Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      alert('a')


	});

//     console.log(file);
// // Points to the root reference
//     var storageRef = firebase.storage().ref();

// // Points to 'images'
//     var imagesRef = storageRef.child('images');

// // Points to 'images/space.jpg'
// // Note that you can use variables to create child values
//     var fileName = 'space.jpg';
//     var spaceRef = imagesRef.child(fileName);

// // File path is 'images/space.jpg'
//     var path = spaceRef.fullPath

// // File name is 'space.jpg'
//     var name = spaceRef.name

// // Points to 'images'
//     var imagesRef = spaceRef.parent;




    const url = 'https://testsmartfund.firebaseio.com/uploadFile';
    return this.http.post(url, file);
  }
}
