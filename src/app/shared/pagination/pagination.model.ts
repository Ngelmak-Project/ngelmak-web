export interface IPage<T> {
  content?: T[]; // The actual page content (list of elements)
  number?: number; // Current page number
  size?: number; // Number of elements per page
  totalElements?: number; // Total number of elements across all pages
  totalPages?: number; // Total number of pages
  isLast?: boolean; // Is this the last page
  isFirst?: boolean; // Is this the first page
  hasNext?: boolean; // Is there a next page
  hasPrevious?: boolean; // Is there a previous page
  sorts?: string[]; // Sorting information
}