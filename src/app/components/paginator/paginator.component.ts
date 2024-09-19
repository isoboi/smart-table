import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { PaginationEvent } from './paginator.interface';

@Component({
  selector: 's-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  onPageChange = output<PaginationEvent>();

  page = signal<number>(1);
  pageSize = signal(10);
  total = input.required<number>();
  totalPageNumbers = computed(() => Math.ceil(this.total() / this.pageSize()));
  pageSizeOptions = signal([10, 25, 50, 100]);

  pageLinks: number[] = [];

  constructor() {
    effect(() => {
      this.updatePageLinksRange();
    });
  }

  private calculatePageLinkRange(): [number, number] {
    let numberOfPages = Math.ceil(this.totalPageNumbers());
    const visiblePages = Math.min(this.pageSize(), numberOfPages);

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.page() - visiblePages / 2)),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    const delta = this.pageSize() - (end - start + 1);
    start = Math.max(0, start - delta);

    return [start, end];
  }

  nextPage(): void {
    if (this.page() < this.total()) {
      this.emitPageChange(this.page() + 1);
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.emitPageChange(this.page() - 1);
    }
  }

  updatePageLinksRange(): void {
    const [start, end] = this.calculatePageLinkRange();
    this.pageLinks = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i + 1,
    );
  }

  pageChange(page: number): void {
    this.emitPageChange(page);
  }

  private emitPageChange(page: number): void {
    this.page.set(page);
    this.onPageChange.emit({ page, size: this.pageSize() });
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(newSize);
    this.page.set(1);
    this.onPageChange.emit({ page: this.page(), size: newSize });
  }
}
