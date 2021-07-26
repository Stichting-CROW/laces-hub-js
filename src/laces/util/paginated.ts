import { FromAPI } from "./types";

/** Paginated API responses */
export interface Paginated<T> {
  /** Items on this page */
  contents: Readonly<T>[];
  /** Total number of items */
  total: number;
}

declare type PaginatedArg0<T> = {
  ({ page }: { page: number }): Promise<Paginated<T>>;
};

declare type PaginatedArg1<T> = {
  (id: string, { page }: { page: number }): Promise<Paginated<T>>;
};

/** Returns all data from a paginated resource. */
export async function allPages<T>(fn: PaginatedArg0<T>): Promise<FromAPI<T>[]> {
  let page = 0;
  const result: T[] = [];
  const data1 = await fn({ page: page });
  result.push(...data1.contents);

  do {
    page = page + 1;
    const dataN = await fn({ page: page });
    result.push(...dataN.contents);
  } while (result.length < data1.total);

  return result as FromAPI<T>[];
}

/** Returns all data from a paginated resource, supplying a single positional parameter. */
export async function allPagesId<T>(fn: PaginatedArg1<T>, id: string): Promise<FromAPI<T>[]> {
  let page = 0;
  const result: T[] = [];
  const data1 = await fn(id, { page: page });
  result.push(...data1.contents);

  do {
    page = page + 1;
    const dataN = await fn(id, { page: page });
    result.push(...dataN.contents);
  } while (data1.total >= result.length);

  return result as FromAPI<T>[];
}
