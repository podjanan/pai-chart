"use client";
import { WheelEvent, useState } from "react";
import { Area, AreaChart, Bar, BarChart, Brush, CartesianGrid, Cell, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { ChartConfig } from "@/types/chart";
import { formatDateTime, formatNumber, sortData } from "@/lib/chart-utils";
import { ChartToolbar } from "./ChartToolbar";

type Props = { config: ChartConfig; onChange: (patch: Partial<ChartConfig>) => void };
type Range = { startIndex?: number; endIndex?: number };

export function ChartPreview({ config, onChange }: Props) {
  const data = sortData(config.data).map((d) => {
    const date = new Date(d.datetime);
    return {
      ...d,
      timeLabel: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, day: "2-digit", month: "short" }).format(date).replace(",", ", "),
      dateLabel: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(date),
      timestamp: date.getTime(),
    };
  });
  const [range, setRange] = useState<Range>({});
  const start = range.startIndex ?? 0;
  const end = range.endIndex ?? Math.max(0, data.length - 1);
  const zoomed = start > 0 || end < data.length - 1;
  const visibleCount = end - start + 1;
  const canZoomIn = data.length > 2 && visibleCount > 2;
  const common = { data, margin: { top: 35, right: 32, left: 16, bottom: 8 } };
  const updateRange = (nextStart: number, nextEnd: number) => setRange({ startIndex: Math.max(0, nextStart), endIndex: Math.min(data.length - 1, nextEnd) });
  const zoomIn = () => { const length = Math.max(2, Math.floor(visibleCount * 0.7)); const middle = Math.round((start + end) / 2); updateRange(middle - Math.floor(length / 2), middle + Math.ceil(length / 2) - 1); };
  const zoomOut = () => { const length = Math.min(data.length, Math.ceil(visibleCount / 0.7)); const middle = Math.round((start + end) / 2); updateRange(middle - Math.floor(length / 2), middle + Math.ceil(length / 2) - 1); };
  const resetZoom = () => setRange({});
  const onWheel = (event: WheelEvent<HTMLDivElement>) => { if (data.length <= 2) return; event.preventDefault(); event.deltaY < 0 ? zoomIn() : zoomOut(); };
  const tooltip = ({ active, payload }: any) => active && payload?.[0] ? <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-xl"><p className="font-medium text-slate-800">{formatDateTime(payload[0].payload.datetime, true)}</p><p className="mt-0.5 text-slate-500">{new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(payload[0].payload.datetime))}</p><div className="my-2 border-t border-slate-100" /><p className="text-slate-500">Value</p><p className="mt-0.5 text-sm font-bold text-violet-700">{formatNumber(payload[0].value)}</p></div> : null;
  const axes = <><XAxis xAxisId="main" dataKey="timeLabel" interval="preserveStartEnd" minTickGap={42} tick={{ fontSize: 11, fill: "#475569" }} tickMargin={10} axisLine={{ stroke: "#94a3b8" }} tickLine={{ stroke: "#cfd5df" }} label={{ value: config.xAxisLabel, position: "insideBottom", offset: -4, fill: "#667085", fontSize: 11 }} /><XAxis xAxisId="top" dataKey="dateLabel" orientation="top" interval="preserveStartEnd" minTickGap={26} tick={{ fontSize: 11, fill: "#64748b" }} tickMargin={8} axisLine={{ stroke: "#cfd5df" }} tickLine={false} height={25} /><YAxis yAxisId="main" tickFormatter={formatNumber} width={66} tick={{ fontSize: 11, fill: "#566178" }} tickMargin={8} axisLine={{ stroke: "#94a3b8" }} tickLine={{ stroke: "#cfd5df" }} label={{ value: config.yAxisLabel, angle: -90, position: "insideLeft", offset: 14, fill: "#667085", fontSize: 11 }} /></>;
  const brush = data.length > 2 ? <Brush dataKey="timeLabel" height={26} stroke="#8b82ed" travellerWidth={9} startIndex={range.startIndex} endIndex={range.endIndex} onChange={(value) => setRange(value)} /> : null;
  const labels = config.showPoints ? <LabelList dataKey="value" position="top" formatter={formatNumber} fill="#485268" fontSize={10} /> : null;
  const maximum = Math.max(...data.map((item) => Number(item.value)), 0);
  const yStep = Math.max(1, Math.ceil(maximum / 1000) * 250);
  const yTicks = Array.from({ length: 5 }, (_, index) => yStep * (4 - index));
  const dateTicks = data.filter((item, index) => index === 0 || item.dateLabel !== data[index - 1].dateLabel);
  const axisOverlay = <div className="pointer-events-none absolute inset-0 z-10 text-[10px] font-medium text-slate-500"><div className="absolute left-5 right-7 top-1 flex justify-between border-b border-slate-200 pb-1 text-slate-600">{dateTicks.map((item) => <span key={`${item.id}-date`}>{item.dateLabel}</span>)}</div><div className="absolute bottom-[42px] left-5 right-7 flex justify-between border-t border-slate-300 pt-2 text-slate-600">{data.map((item, index) => <span key={`${item.id}-time`} className={`w-20 text-center leading-3 ${index === 0 ? "-translate-x-1/2" : ""} ${index === data.length - 1 ? "translate-x-1/2" : ""}`}>{item.timeLabel}</span>)}</div><div className="absolute left-0 top-[43px] bottom-[58px] flex flex-col justify-between text-right">{yTicks.map((tick) => <span key={tick}>{formatNumber(tick)}</span>)}</div></div>;
  const header = <div className="mb-6 flex flex-col justify-between gap-4"><div><p className="text-lg font-bold tracking-tight text-slate-900">{config.title || "Untitled chart"}</p><p className="mt-1 text-xs text-slate-500">Use mouse wheel or zoom controls to inspect values closely.</p></div><ChartToolbar config={config} onChange={onChange} isZoomed={zoomed} canZoomIn={canZoomIn} onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom} /></div>;
  if (!data.length) return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">{header}<div className="flex h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center"><div className="rounded-2xl bg-violet-100 p-4 text-violet-600"><BarChart3 size={28} /></div><p className="mt-4 text-sm font-semibold text-slate-700">Your chart will appear here</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Add valid date/time and numeric values in the data editor to visualize your data.</p></div></section>;
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">{header}<div id="chart-export" onWheel={onWheel} className="relative h-[420px] w-full touch-pan-y">{axisOverlay}<ResponsiveContainer width="100%" height="100%">{config.chartType === "bar" ? <BarChart {...common}>{config.showGrid && <CartesianGrid stroke="#e9ecf2" strokeDasharray="3 3" vertical={false} />}{axes}<Tooltip content={tooltip} cursor={{ fill: "#f3f2ff" }} /><Bar xAxisId="main" yAxisId="main" dataKey="value" radius={[6, 6, 0, 0]} fill="#6b61e8">{data.map((entry) => <Cell key={entry.id} fill="#6b61e8" />)}{labels}</Bar>{brush}</BarChart> : config.chartType === "area" ? <AreaChart {...common}>{config.showGrid && <CartesianGrid stroke="#e9ecf2" strokeDasharray="3 3" vertical={false} />}{axes}<Tooltip content={tooltip} /><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#746be9" stopOpacity={0.42} /><stop offset="100%" stopColor="#746be9" stopOpacity={0.02} /></linearGradient></defs><Area xAxisId="main" yAxisId="main" type={config.smoothLine ? "monotone" : "linear"} dataKey="value" stroke="#6257e8" strokeWidth={3} fill="url(#chartGradient)" dot={config.showPoints ? { r: 4, fill: "#fff", strokeWidth: 2 } : false}>{labels}</Area>{brush}</AreaChart> : <LineChart {...common}>{config.showGrid && <CartesianGrid stroke="#e9ecf2" strokeDasharray="3 3" vertical={false} />}{axes}<Tooltip content={tooltip} /><Line xAxisId="main" yAxisId="main" type={config.smoothLine ? "monotone" : "linear"} dataKey="value" stroke="#6257e8" strokeWidth={3} dot={config.showPoints ? { r: 4, fill: "#fff", strokeWidth: 2 } : false} activeDot={{ r: 6, fill: "#6257e8" }}>{labels}</Line>{brush}</LineChart>}</ResponsiveContainer></div></section>;
}
