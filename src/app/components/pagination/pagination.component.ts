import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  SimpleChange,
} from '@angular/core';
import { PagerService } from 'src/app/services/pager.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  // Current page number
  currentPageNumber: number = 1;
  // Total records count
  totalRecordsCount: number = 0;
  // Total pages
  totalPages: number = 0;
  // Pager
  pager: any = {};

  constructor(private http: HttpClient, private pagerService: PagerService) {}

  // API route
  @Input() apiRoute: string = '';
  // Search term
  @Input() searchTerm: string = '';
  // Records per page
  @Input() recordsPerPage: number = 0;
  // Response data
  @Output() responseData = new EventEmitter<any[]>();
  // Loading
  @Output() loading = new EventEmitter<boolean>();
  // Reload
  @Input() reload: EventEmitter<boolean> | undefined;

  // On init
  ngOnInit() {
    this.watchReload();
  }

  // To be emitted from parent component
  watchReload() {
    if (this.reload) {
      this.reload.subscribe((reload: any) => {
        if (reload) {
          this.getData(this.currentPageNumber);
        }
      });
    }
  }

  // Fetch new page data
  next() {
    this.getData(this.currentPageNumber + 1)
  }
  
  // Fetch previous page data
  prev() {
    this.getData(this.currentPageNumber - 1)
  }

  // Fetch data from API
  getData(pageNo: any) {
    this.loading.emit(true);
    this.currentPageNumber = Number(pageNo);
    let finalPath = `${this.apiRoute}?pageNumber=${this.currentPageNumber}&recordsPerPage=${this.recordsPerPage}`;

    // add search term only if search available
    if (this.searchTerm && this.searchTerm.length) {
      finalPath = `${finalPath}&searchTerm=${this.searchTerm}`;
    }

    this.http.get(finalPath).subscribe(
      (response: any) => {
        this.totalRecordsCount = response.count;
        this.responseData.emit(response.data);
        this.totalPages = Math.ceil(response.count / this.recordsPerPage);
        this.setPagination(this.currentPageNumber);
        this.loading.emit(false);
      },
      (error) => {
        this.loading.emit(false);
        alert(error.message);
      }
    );
  }

  // Set pagination data and pager data
  setPagination(pageNo: any) {
    pageNo = Number(pageNo);
    this.currentPageNumber = pageNo;
    this.pager = this.pagerService.getPager(
      this.totalRecordsCount,
      pageNo,
      this.recordsPerPage
    );
  }

  // Set the record count
  setRecordCount(limit: any) {
    this.recordsPerPage = limit;
    this.getData(this.currentPageNumber);
  }

  // Watch for changes: [searchTerm & recordsPerPage]
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const term = changes['searchTerm'] && changes['searchTerm'].currentValue;
    const recordsPerPage =
      changes['recordsPerPage'] && changes['recordsPerPage'].currentValue;
    if (term) {
      this.getData(this.currentPageNumber);
    }
    if (recordsPerPage) {
      this.getData(this.currentPageNumber);
    }
  }

  // Track by
  trackByFn(index: any, item: any) {
    return item; // or item.id
  }
}
