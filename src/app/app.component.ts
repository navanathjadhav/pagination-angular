import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private fb: FormBuilder) {}
  
  // Defaults
  form!: FormGroup;
  students: any = [];
  searchTerm: string = '';
  reload: EventEmitter<boolean> = new EventEmitter();
  isLoadingStudents: boolean = false;
  recordsPerPage: number = 5;

  ngOnInit(): void {
    this.buildForm();
  }

  // Init form
  buildForm() {
    this.form = this.fb.group({
      term: ['', [Validators.required]],
      recordsPerPage: [''],
    });
  }

  // On form submit => assign search term
  submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.searchTerm = this.form.value.term;
  }

  // Clear search results on search box empty
  clearSearchResult() {
    if (this.form.controls.term.value === '' && this.searchTerm) {
      this.searchTerm = '';
      setTimeout(() => {
        this.reload.emit(true);
        this.reload.emit(false);
      }, 100);
    }
  }
}
