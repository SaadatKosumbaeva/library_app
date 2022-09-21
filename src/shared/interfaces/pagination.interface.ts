import { SortType } from '../types/sort-type';

export interface IPaginationParams {
  take?: number;
  page?: number;
  dateFrom?: string;
  dateTo?: string;
  sortType?: SortType;
}
