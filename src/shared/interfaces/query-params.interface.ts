import { IPaginationParams } from './pagination.interface';

export interface QueryParams extends IPaginationParams {
  name?: string;
  title?: string;
}
