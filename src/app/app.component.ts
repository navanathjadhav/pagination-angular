import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  form!: FormGroup;
  title = 'pagination-angular';
  students: any = [];
  pager: any = {};
  loading: boolean = false;
  searchTerm: string = '';
  reload: EventEmitter<boolean> = new EventEmitter();
  isLoadingStudents: boolean = false;
  recordsPerPage: number = 5;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      term: ['', [Validators.required]],
      recordsPerPage: [''],
    });
  }

  submitForm(): void {
    console.log('this.form', this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.searchTerm = this.form.value.term;
  }

  applyValidations() {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
  }

  clearSearchResult() {
    if (!this.form.controls.term.value && this.searchTerm) {
      this.searchTerm = '';
      this.reload.emit(true);
      setTimeout(() => {
        this.reload.emit(false);
      }, 1000);
    }
  }
}
