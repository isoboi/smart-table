import { Component, computed, contentChild, input, output, signal, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ColumnInterface, SortState } from './table.interface';
import { PaginatorComponent } from '../paginator/paginator.component';
import { NestedValuePipe } from './nested-value.pipe';
import { TableBodyDirective } from './template';
import { PaginationEvent } from '../paginator/paginator.interface';
import { PaginationPipe } from './pagination.pipe';

@Component({
  selector: 's-table',
  standalone: true,
  imports: [PaginatorComponent, NestedValuePipe, TableBodyDirective, NgTemplateOutlet, PaginationPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  sortChanged = output<SortState>();

  columns = input<ColumnInterface[]>([]);
  value = input<any[]>([]);
  paginator = input<boolean>(false);
  columnSorting = input<string[]>([]);

  pagination = signal({ page: 1, size: 10 });
  sortingState = signal<SortState>({
    field: '',
    direction: '',
  });

  totalPages = computed(() => this.value().length);

  bodyTemplate = contentChild(TableBodyDirective, { read: TemplateRef });

  onPageChange(pagination: PaginationEvent): void {
    this.pagination.set(pagination);
  }

  onSortChange(column: ColumnInterface): void {
    if (!this.columnSorting().includes(column.value as string)) {
      return;
    }

    const field = column.value as string;
    const currentSortField = this.sortingState().field;
    const currentSortDirection = this.sortingState().direction;

    if (!currentSortField || !currentSortDirection) {
      this.sortingState.set({ field, direction: 'asc' });
    } else if (this.isDescSorting(field)) {
      this.sortingState.set({ field: '', direction: '' });
    } else {
      this.sortingState.set({ field, direction: 'desc' });
    }

    this.sortChanged.emit(this.sortingState());
  }

  isDescSorting(column: string): boolean {
    return this.sortingState().field === column && this.sortingState().direction === 'desc';
  }

  isAscSorting(column: string): boolean {
    return this.sortingState().field === column && this.sortingState().direction === 'asc';
  }
}
