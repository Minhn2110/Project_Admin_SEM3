import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position:any;
  private:any;
  fork:any;
}



const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', private: 1.0079, fork: 'H'},
  {position: 2, name: 'Helium', private: 4.0026, fork: 'He'},
  {position: 3, name: 'Lithium', private: 6.941, fork: 'Li'},
  {position: 4, name: 'Beryllium', private: 9.0122, fork: 'Be'},
  {position: 5, name: 'Boron', private: 10.811, fork: 'B'},
];

@Component({
  selector: 'app-plainsight',
  templateUrl: './plainsight.component.html',
  styleUrls: ['./plainsight.component.css']
})


export class PlainsightComponent implements OnInit {
  username: any;
  price: any;

  constructor() { }


  column = [
    {columnDef: 'checkBox', header: '', cell: element => ``},
    {columnDef: 'productName', header: 'Name', cell: element => `${element.name}`},
    {columnDef: 'type', header: 'Type', cell: element => `${element.private}`},
    {columnDef: 'price', header: 'Price', cell: element => `${element.fork}`},
    {columnDef: 'addToCart', header: '', cell: element => ``},
  ]

  productList = [];
  selectedItems = [];
  length = 30;
  pageSize = 5;
  pageIndex = 1;

  displayedColumns = this.column.map(item => item.columnDef);
  filteredColumn = this.column.filter(item => {
    return item.columnDef !== 'checkBox' && item.columnDef !== 'addToCart'
  })

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    // console.log('displayedColumns', this.displayedColumns);
    // console.log('filterColumns', this.filteredColumn);
    // console.log('filterColumns', this.column);


    this.getData(this.pageSize, this.pageIndex);
  }
  getData(pageSize, pageIndex) {
    const url = `https://api.github.com/users/geerlingguy/repos?per_page=${pageSize}&page=${pageIndex}`;
    ajax({
      url: url,
      method: 'GET',
      responseType: "json",
    }).pipe(
      map(response => response.response),
      catchError(error => {
        console.log('error: ', error);
        return of(error);
      })
    ).subscribe(item => {
      this.productList = item;
      // this.length = this.getRandomInt(40);
      this.length = 40;


      console.log('data', item);
      this.dataSource = new MatTableDataSource(this.productList);
      // this.dataSource.paginator = this.paginator;
    })
  }

  changePage(event) {
    console.log(event);
    this.getData(event.pageSize, event.pageIndex + 1);
    // alert('a');
  }

  search() {
    // Reset Page index, Page size when search
    this.paginator.pageIndex = 0;
    this.length = 100;
    this.dataSource.data = ELEMENT_DATA;
  }

   getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  



  addItem(event, row) {
    // set checked in productList
    if(event.checked) {
      row.checked = event.checked
    } else {
      row.checked = false;
    }
    this.selectedItems = this.productList.filter(item => {
      return item.checked == true;
    });
    console.log(this.productList);

  }
  addToCart() {
    console.log(this.selectedItems);
    this.productList.forEach(item => {
      item.checked = false;
    });
    this.dataSource = new MatTableDataSource(this.productList);
    this.dataSource.paginator = this.paginator;
    this.selectedItems = [];

  }

  searchForm() {
    console.log(this.username);
    const url = `https://localhost:44335/api/Products`;
    ajax({
      url: url,
      body: {Name: this.username, Price: this.price},
      method: 'POST',
      responseType: "json",
    }).pipe(
      map(response => response),
      catchError(error => {
        console.log('error: ', error);
        return of(error);
      })
    ).subscribe(item => {
      console.log(item);
    })
  }
  getForm() {
    console.log(this.username);
    const url = `https://localhost:44335/api/Products`;
    ajax({
      url: url,
      body: {},
      method: 'GET',
      responseType: "json",
    }).pipe(
      map(response => response),
      catchError(error => {
        console.log('error: ', error);
        return of(error);
      })
    ).subscribe(item => {
      console.log(item);
    })
  }
}
