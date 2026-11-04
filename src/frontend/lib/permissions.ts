import type { Permission, Role } from '../types';
const grants: Record<Role, Permission[]> = { Administrateur:['read','write','delete','finance','admin'],Finance:['read','write','finance'],Opérateur:['read','write'],Support:['read','write'],Observateur:['read'] };
export function can(role: Role | undefined, permission: Permission = 'read') { return !!role && grants[role]?.includes(permission); }
