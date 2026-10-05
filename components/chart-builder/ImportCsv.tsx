"use client";
import { Upload } from "lucide-react";
import { parseCsv } from "@/lib/csv-utils";
import { ChartData } from "@/types/chart";
export function ImportCsv({ onImport }: { onImport: (rows: ChartData[], error?: string) => void }) { return <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700"><Upload size={14} /> Import CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const parsed = parseCsv(String(reader.result)); onImport(parsed.rows, parsed.error); }; reader.readAsText(file); e.target.value = ""; }} /></label>; }
