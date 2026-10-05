import { ChartData } from "@/types/chart";
export const formatDateTime = (value: string, includeYear = false) => { const date = new Date(value); if (Number.isNaN(date.getTime())) return value || "—"; return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", ...(includeYear ? { year: "numeric" } : {}), hour: "2-digit", minute: "2-digit", hour12: false }).format(date).replace(",", ""); };
export const formatNumber = (value: number | "") => typeof value === "number" && Number.isFinite(value) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(value) : "—";
export const isValidRow = (row: ChartData) => Boolean(row.datetime) && !Number.isNaN(new Date(row.datetime).getTime()) && typeof row.value === "number" && Number.isFinite(row.value);
export const sortData = (rows: ChartData[]) => [...rows].filter(isValidRow).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
