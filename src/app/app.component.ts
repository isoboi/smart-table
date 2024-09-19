import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe, NgIf } from '@angular/common';
import { delay, finalize } from 'rxjs';

import { TableComponent } from './components/table/table.component';
import { ApiService } from './services/api.service';
import { UserInterface } from './models/user.interface';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { TableBodyDirective } from './components/table/template';
import { NestedValuePipe } from './components/table/nested-value.pipe';
import { SelectComponent } from './components/select/select.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { ColumnInterface, SortState } from './components/table/table.interface';
import { SelectOptionInterface } from './components/select/select.option.interface';

const DEFAULT_COLUMNS: ColumnInterface[] = [
  {
    label: 'Avatar',
    value: 'picture',
    checked: true,
  },
  {
    label: 'Email',
    value: 'email',
    checked: true,
  },
  {
    label: 'Full Name',
    value: 'name.first',
    checked: true,
  },
  {
    label: 'Age',
    value: 'age',
    checked: true,
  },
  {
    label: 'Company',
    value: 'company',
    checked: true,
  },
  {
    label: 'Favorite Fruit',
    value: 'favoriteFruit',
    checked: true,
  },
  {
    label: 'Status',
    value: 'isActive',
    checked: true,
  },
];

const DEFAULT_STATUS: SelectOptionInterface[] = [
  {
    label: 'Active',
    value: true,
  },
  {
    label: 'Inactive',
    value: false,
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TableComponent,
    FormsModule,
    PaginatorComponent,
    TableBodyDirective,
    JsonPipe,
    NestedValuePipe,
    SelectComponent,
    MultiSelectComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [NestedValuePipe],
})
export class AppComponent implements OnInit {
  // State
  private users = signal<UserInterface[]>([]);
  loading = signal(false);
  usersFiltered = signal<UserInterface[]>([]);
  favouriteFruits = signal<SelectOptionInterface[]>([]);

  // Computed Properties
  public columnsFiltered = computed(() => this.columns().filter((column) => column.checked));

  // Form
  public formFilter = new FormGroup({
    search: new FormControl(null),
    isActive: new FormControl(null),
    favouriteFruit: new FormControl(null),
    columns: new FormControl([]),
  });

  // Data
  public columns = signal<ColumnInterface[]>(DEFAULT_COLUMNS);
  public status = signal(DEFAULT_STATUS);

  // Services
  private readonly apiService = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private nestedValue = inject(NestedValuePipe);

  ngOnInit(): void {
    this.getData();

    this.formFilter.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.applyFilter(value);
    });
  }

  private applyFilter(formValue: any): void {
    const { search, isActive, favouriteFruit, columns } = formValue;

    const filteredUsers = this.users().filter((user) => {
      const matchIsActive = isActive === null || user.isActive === isActive;
      const searchMatch =
        // @ts-ignore
        search === null || Object.keys(user).some((key) => String(user[key]).toLowerCase().includes(search));
      const matchFavoriteFruit = favouriteFruit === null || user.favoriteFruit === favouriteFruit;
      return searchMatch && matchIsActive && matchFavoriteFruit;
    });

    this.usersFiltered.set(filteredUsers);

    if (columns && Array.isArray(columns) && columns.length > 0) {
      this.toggleColumns(columns);
    }
  }

  public getData(): void {
    this.loading.set(true);
    this.apiService
      .getUsers()
      .pipe(
        delay(2000),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((users) => {
        this.users.set(users);
        this.usersFiltered.set(users);

        const favoriteFruits = [...new Set(users.map((user) => user.favoriteFruit))].map((fruit) => {
          return { label: fruit, value: fruit };
        });
        this.favouriteFruits.set(favoriteFruits);
      });
  }

  private toggleColumns(newColumns: SelectOptionInterface[]): void {
    const updatedColumns = DEFAULT_COLUMNS.map((column) => ({
      ...column,
      checked: newColumns.some((newColumn) => newColumn.value === column.value),
    }));

    this.columns.set(updatedColumns);
  }

  isExistColumn(field: string): boolean {
    return this.columnsFiltered().some((c) => c.value === field);
  }

  applySort(sortState: SortState): void {
    const { field, direction } = sortState;
    const data = [...this.usersFiltered()];
    if (field) {
      data.sort((a, b) => {
        const valueA = this.nestedValue.transform(a, field);
        const valueB = this.nestedValue.transform(b, field);

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }

        if (valueA < valueB) {
          return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.usersFiltered.set(data);
  }

  clearFilter(): void {
    this.formFilter.patchValue({
      search: null,
      isActive: null,
      favouriteFruit: null,
    });
  }
}
