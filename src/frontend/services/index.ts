import { administrationServices } from './administration';
import { schoolServices } from './school';
import { financeServices } from './finance';
import { operationsServices } from './operations';
export const services = {...administrationServices,...schoolServices,...financeServices,...operationsServices};
