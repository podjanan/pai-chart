export type ChartType = "line" | "bar" | "area";
export interface ChartData { id: string; datetime: string; value: number | ""; }
export interface ChartConfig { id: string; title: string; xAxisLabel: string; yAxisLabel: string; chartType: ChartType; showPoints: boolean; smoothLine: boolean; showGrid: boolean; data: ChartData[]; }
export interface SavedChart extends ChartConfig { savedAt: string; }
