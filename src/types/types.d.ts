export declare type MarkRequired<T, ReqK extends keyof T> = Exclude<T, ReqK> &
  Required<Pick<T, ReqK>>;
export declare type MarkOptional<T, OptK extends keyof T> = Omit<T, OptK> & Partial<Pick<T, OptK>>;
