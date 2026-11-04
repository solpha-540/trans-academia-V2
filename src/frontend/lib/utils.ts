import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const money = (value: number, currency = 'CDF') => new Intl.NumberFormat('fr-CD', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
export const number = (value: number) => new Intl.NumberFormat('fr-FR').format(value);
export function exportCsv(rows: Record<string, unknown>[], filename: string) {
 if (!rows.length) return;
 const keys = Object.keys(rows[0]);
 const escape = (v: unknown) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"','""') + '"';
 const csv = '\uFEFF' + [keys.map(escape).join(';'), ...rows.map(row => keys.map(k => escape(row[k])).join(';'))].join('\r\n');
 const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
 const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
}
