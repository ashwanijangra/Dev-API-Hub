export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface HeaderItem {
  key: string;
  value: string;
}

export interface ParamItem {
  key: string;
  value: string;
}

export interface ApiResponse {
  status: number | string;
  statusText?: string;
  data: any;
  time: number;
  responseHeaders?: Record<string, string>;
}

export interface RequestTab {
  id: string;
  name: string;
  saved: boolean;
  collectionId?: string;
  dirty: boolean;

  method: HttpMethod;
  url: string;
  body: string;
  headers: HeaderItem[];
  params: ParamItem[];
  token: string;

  response: ApiResponse | null;
}

export interface EnvVariable {
  key: string;
  value: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvVariable[];
}