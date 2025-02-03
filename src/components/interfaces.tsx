export interface LineInfo {
  id: string;
  key: string;
  interval: number;
  enable: boolean;
  // 1点按, 2长按
  type: number;
}
