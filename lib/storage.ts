import { SavedChart } from "@/types/chart";
const KEY = "chartpai-saved-charts";
export const getSavedCharts = (): SavedChart[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export const persistChart = (chart: SavedChart) => localStorage.setItem(KEY, JSON.stringify([chart, ...getSavedCharts().filter((item) => item.id !== chart.id)]));
export const removeSavedChart = (id: string) => localStorage.setItem(KEY, JSON.stringify(getSavedCharts().filter((item) => item.id !== id)));
