import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ajax } from 'rxjs/ajax';
import { map, catchError, switchMap, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { of, fromEvent, interval, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserCreateComponent } from './user-create/user-create.component';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdminServiceService } from '../service/admin-service.service';

export interface PeriodicElement {
  name: string;
  position: any;
  private: any;
  fork: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', private: 1.0079, fork: 'H' },
  { position: 2, name: 'Helium', private: 4.0026, fork: 'He' },
  { position: 3, name: 'Lithium', private: 6.941, fork: 'Li' },
  { position: 4, name: 'Beryllium', private: 9.0122, fork: 'Be' },
  { position: 5, name: 'Boron', private: 10.811, fork: 'B' },
];

@Component({
  selector: 'app-plainsight',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class PlainsightComponent implements OnInit {
  username: any;
  price: any;

  constructor(public dialog: MatDialog, private service: AdminServiceService) {}


  openDialog(): void {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: '650px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.service.createProductList().subscribe(response => {
      //   console.log(response);
      // });
      // console.log('The dialog was closed');
    });
  }

  column = [
    { columnDef: 'STT', header: '', cell: element => `` },
    { columnDef: 'name', header: 'Product Name', cell: element => `${element.Name}` },
    { columnDef: 'price', header: 'Price', cell: element => `${element.Price}` },
    { columnDef: 'InStock', header: 'Quantity', cell: element => `${element.InStock}` },
    { columnDef: 'CreateAt', header: 'Create At', cell: element => `${element.CreateAt}` },
    { columnDef: 'UpdateAt', header: 'Update At', cell: element => `${element.UpdateAt}` },
    { columnDef: 'DeleteAt', header: 'Delete At', cell: element => `${element.DeleteAt}` },
    { columnDef: 'status', header: 'Status', cell: element => `${element.Status == 1 ? 'Active' : 'Deactive'}`},


    { columnDef: 'addToCart', header: '', cell: element => `` },
  ]

  productList = [];
  selectedItems = [];
  length = 30;
  // Default page size

  selectOption: any;


  // New
  sortType = 'asc';
  sortBy = 'price';
  pageSize = 10;
  pageIndex = 0;

  displayedColumns = this.column.map(item => item.columnDef);
  filteredColumn = this.column.filter(item => {
    return item.columnDef !== 'STT' &&  item.columnDef !== 'addToCart'
  })

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.initPagination();
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.searchLogic();
  }

  initPagination() {
    this.service.getProductList('', 'asc', 'price', 0, 10).subscribe(data =>  {
      this.handleData(data);
    });
  }
  handleData(data) {
      if(data.Products.length > 0) {
        console.log('aaa', data);
        this.dataSource = new MatTableDataSource(data.Products);
        this.length = data.TotalItems;
      }
  }
  changePageLogic(event) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.service.getProductList('', this.sortType, this.sortBy ,event.pageIndex, event.pageSize).subscribe(data => {
      this.handleData(data);
    });
  }


  getData(pageIndex, pageSize, search, sortBy, order) {
    // const url = `https://api.github.com/users/geerlingguy/repos?per_page=${pageSize}&page=${pageIndex}`;
    // const url = `https://5dcb83d334d54a001431503b.mockapi.io/api/paging/book?page=${pageIndex}&limit=${pageSize}&search=${search}&sortBy=${sortBy}&order=${order}`;
    const url = `https://api-demo-sem3.azurewebsites.net/api/Products?keyword&sortType=asc&sortBy=price&pageNumber=0&pageSize=10`;

    ajax({
      url: url,
      method: 'GET',
      responseType: "json",
    }).pipe(
      map(response => response),
      catchError(error => {
        console.log('error: ', error);
        return of(error);
      })
    ).subscribe(item => {
      // debugger;
      this.productList = item;
      // this.length = this.getRandomInt(40);
      this.length = 40;


      console.log('data', item);
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    })
  }

  searchLogic() {
    const keyup$ = fromEvent(this.searchInput.nativeElement, 'keyup');
    keyup$.pipe(
      tap((i: any) => console.log('i', i.currentTarget.value)),
      // debounceTime(500),
      // distinctUntilChanged(),
      switchMap((i: any) => {
        const searchWord = i.currentTarget.value;
        return ajax({
          url: `https://api-demo-sem3.azurewebsites.net/api/Products?keyword=${searchWord}&sortType=${this.sortType}&sortBy=${this.sortBy}&pageNumber=${this.pageIndex}&pageSize=${this.pageSize}`,
          method: 'GET',
        }).pipe(catchError(err => of(err)));
      }),
    )
      .subscribe((response) => {
        if (response) {
          console.log(response);
          this.resetDataSource(response.response.Products);
        }
      });
  }
  selectLogic() {
    console.log('select', this.selectOption);
    // Reset pageIndex in Material Table
    // this.service.getProductList('', 'asc', 'price',event.pageIndex, event.pageSize).subscribe(data => {
    //   if (data) {
    //     this.paginator.pageIndex = 0;
    //     this.handleData(data);
    //   }
    // });
    // this.getData(1, this.pageSize, this.selectOption, this.sortBy, this.order);
  }
  sortLogic(event) {
    this.service.getProductList('', event.direction, event.active, 0, this.pageSize).subscribe(data => {
      if (data) {
        this.paginator.pageIndex = 0;
        this.sortBy = event.active;
        this.sortType = event.direction;        
        this.handleData(data);
      }
    });
    console.log('sort', event);
  }
  resetDataSource(datasource) {
    this.paginator.pageIndex = 0;
    this.dataSource = new MatTableDataSource(datasource);
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
    if (event.checked) {
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
      body: { Name: this.username, Price: this.price },
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
