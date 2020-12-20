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
  currentPage: number = 1;
  totalCount: number = 0;
  totalRecordsPage: number = 5;
  pager: any = {};
  constructor(private http: HttpClient, private pagerService: PagerService) {}
  @Input() apiRoute: string = '';
  @Input() searchTerm: string = '';
  @Input() recordsPerPage: number = 0;
  @Output() responseData = new EventEmitter<any[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Input() reload: EventEmitter<boolean> | undefined;

  // On init
  ngOnInit() {
    this.watchReloadFlag();
  }

  // reload will be emitted from parent component
  watchReloadFlag() {
    if (this.reload) {
      this.reload.subscribe((reload: any) => {
        if (reload) {
          this.getData(this.currentPage);
        }
      });
    }
  }

  // get the data from API
  getData(pageNo: any) {
    this.loading.emit(true);
    this.currentPage = Number(pageNo);
    let finalPath = `${this.apiRoute}?pageNumber=${this.currentPage}&recordsPerPage=${this.recordsPerPage}`;

    // add search term only if search available
    if (this.searchTerm && this.searchTerm.length) {
      finalPath = `${finalPath}&searchTerm=${this.searchTerm}`;
    }

    this.http.get(finalPath).subscribe(
      (response: any) => {
        this.totalCount = response.count;
        this.responseData.emit(response.data);
        this.totalRecordsPage = Math.ceil(response.count / this.recordsPerPage);
        this.setPagination(this.currentPage);
        this.loading.emit(false);
      },
      (error) => {
        this.loading.emit(false);
        alert(error.message)
      }
    );
  }

  // Set pagination data and pager data
  setPagination(pageNo: any) {
    pageNo = Number(pageNo);
    this.currentPage = pageNo;
    this.pager = this.pagerService.getPager(
      this.totalCount,
      pageNo,
      this.recordsPerPage
    );
  }

  // Set the record count
  setRecordCount(limit: any) {
    this.recordsPerPage = limit;
    this.getData(this.currentPage);
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const term = changes['searchTerm'] && changes['searchTerm'].currentValue;
    const recordsPerPage =
      changes['recordsPerPage'] && changes['recordsPerPage'].currentValue;
    if (term) {
      this.getData(this.currentPage);
    }
    if (recordsPerPage) {
      this.getData(this.currentPage);
    }
  }

  trackByFn(index: any, item: any) {
    return item; // or item.id
  }
}
