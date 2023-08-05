
export interface getUserDto{
  page: number;
  limit?: number;
  username?: string;
  role?: number; // !下拉框选择
  gender?:number;
}