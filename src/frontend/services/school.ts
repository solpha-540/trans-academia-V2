import { resourceService } from './resource';
export const schoolServices = Object.fromEntries(['students','registrations','cards','subscriptions'].map(key=>[key,resourceService(key)]));
