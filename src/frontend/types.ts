export type Role = 'Administrateur' | 'Finance' | 'Opérateur' | 'Support' | 'Observateur';
export type Module = 'all' | 'interurbain' | 'kelasi' | 'etudiant';
export type Permission = 'read' | 'write' | 'delete' | 'finance' | 'admin';
export interface User { id: string; name: string; email: string; role: Role; }
export interface Session { user: User; token: string; expiresAt: number; }
export type RecordItem = { id: string; name: string; status: string; module: string; createdAt: string; [key: string]: string | number | boolean };
export interface ListParams { page: number; pageSize: number; search: string; status: string; module: string; sort: string; order: 'asc' | 'desc'; from?: string; to?: string; }
export interface ListResult { data: RecordItem[]; total: number; page: number; pageSize: number; }
export interface Field { key: string; label: string; type?: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea'; options?: string[]; required?: boolean; min?: number; }
export interface ResourceConfig { key: string; title: string; singular: string; description: string; group: string; permission?: Permission; fields: Field[]; columns: string[]; statuses: string[]; }
