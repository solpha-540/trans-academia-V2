import { describe,it,expect } from 'vitest';
import { seed } from '../mocks/data';
import { buildDashboard } from '../mocks/dashboard';
describe('Dashboard aggregates',()=>{
 it('keeps chart totals equal to the KPIs',()=>{const data=buildDashboard(seed().records,'all',30);expect(data.series.reduce((s,p)=>s+p.transactions,0)).toBe(data.transactions);expect(data.series.reduce((s,p)=>s+p.revenue,0)).toBe(data.revenue);expect(data.distribution.reduce((s,p)=>s+p.value,0)).toBe(data.transactions);});
 it('scopes every statistic to the selected module and period',()=>{const records=seed().records;const week=buildDashboard(records,'kelasi',7);const month=buildDashboard(records,'kelasi',30);expect(week.transactions).toBeLessThanOrEqual(month.transactions);expect(week.recent.every(r=>r.module==='kelasi')).toBe(true);expect(week.distribution.filter(d=>d.name!=='Kelasi').every(d=>d.value===0)).toBe(true);expect(week.series).toHaveLength(7);});
});
