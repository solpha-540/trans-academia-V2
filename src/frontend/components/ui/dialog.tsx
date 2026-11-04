import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({title,description,children,wide=false}:{title:string;description?:string;children:ReactNode;wide?:boolean}) {return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="dialog-overlay"/><DialogPrimitive.Content className={'dialog-content '+(wide?'dialog-wide':'')} aria-describedby={description?'dialog-description':undefined}><div className="dialog-heading"><div><DialogPrimitive.Title>{title}</DialogPrimitive.Title>{description&&<DialogPrimitive.Description id="dialog-description">{description}</DialogPrimitive.Description>}</div><DialogPrimitive.Close className="btn btn-ghost btn-icon" aria-label="Fermer"><X size={19}/></DialogPrimitive.Close></div>{children}</DialogPrimitive.Content></DialogPrimitive.Portal>;}
