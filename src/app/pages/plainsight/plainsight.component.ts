import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ajax } from 'rxjs/ajax';
import { map, catchError, switchMap, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { of, fromEvent, interval } from 'rxjs';
import { MatSort } from '@angular/material/sort';

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
  templateUrl: './plainsight.component.html',
  styleUrls: ['./plainsight.component.scss']
})


export class PlainsightComponent implements OnInit {
  username: any;
  price: any;

  constructor() { }


  column = [
    { columnDef: 'checkBox', header: '', cell: element => `` },
    { columnDef: 'id', header: 'Id', cell: element => `${element.id}` },
    { columnDef: 'productName', header: 'Name', cell: element => `${element.giveName}` },
    { columnDef: 'type', header: 'Type', cell: element => `${element.company}` },
    { columnDef: 'price', header: 'Price', cell: element => `${element.surname}` },
    { columnDef: 'addToCart', header: '', cell: element => `` },
  ]

  productList = [];
  selectedItems = [];
  length = 30;
  pageSize = 5;
  pageIndex = 1;
  sortBy = '';
  order = '';
  selectOption: any;

  displayedColumns = this.column.map(item => item.columnDef);
  filteredColumn = this.column.filter(item => {
    return item.columnDef !== 'checkBox' && item.columnDef !== 'addToCart'
  })

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {

    // console.log('displayedColumns', this.displayedColumns);
    // console.log('filterColumns', this.filteredColumn);
    // console.log('filterColumns', this.column);


    this.getData(this.pageIndex, this.pageSize, '', this.sortBy, this.order);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.searchLogic();
  }
  getData(pageIndex, pageSize, search, sortBy, order) {
    // const url = `https://api.github.com/users/geerlingguy/repos?per_page=${pageSize}&page=${pageIndex}`;
    const url = `https://5dcb83d334d54a001431503b.mockapi.io/api/paging/book?page=${pageIndex}&limit=${pageSize}&search=${search}&sortBy=${sortBy}&order=${order}`;

    ajax({
      url: url,
      method: 'GET',
      // body: {
      //   limit: '',
      //   page: '',
      //   search: '',
      //   sortBy:

      // },
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
          url: `https://5dcb83d334d54a001431503b.mockapi.io/api/paging/book?page=1&limit=${this.pageSize}&search=${searchWord ? searchWord : ''}`,
          method: 'GET',
        }).pipe(catchError(err => of(err)));
      }),
    )
      .subscribe((response) => {
        if (response) {
          console.log(response);
          this.resetDataSource(response.response);
        }
      });
  }
  selectLogic() {
    console.log('select', this.selectOption);
    // Reset pageIndex in Material Table
    this.paginator.pageIndex = 0;
    this.getData(1, this.pageSize, this.selectOption, this.sortBy, this.order);
  }
  sortLogic(event) {
    this.paginator.pageIndex = 0;
    this.sortBy = event.active;
    this.order = event.direction;
    this.getData(1, this.pageSize, '', event.active, event.direction);
    console.log('sort', event);
  }
  resetDataSource(datasource) {
    this.dataSource = new MatTableDataSource(datasource);
  }

  changePage(event) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.getData(event.pageIndex + 1, event.pageSize, '', this.sortBy, this.order);
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
