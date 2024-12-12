export interface Wrapper<T> {
  statusCode: number;
  messages: any;
  result: Result<T>;
}

export interface WrapperWithoutCount<T> {
  statusCode: number;
  messages: string[];
  result: T[];
}

export interface Result<T> {
  data: T[];
  count: number;
}

export interface PaginatorModel {
  count: number;
  page: number;
}

export interface SelectBoxModel {
  key: number;
  value: string;
}
