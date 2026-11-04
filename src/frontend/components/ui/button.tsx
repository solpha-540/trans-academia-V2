import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva,type VariantProps } from 'class-variance-authority';
import SpkButton from '../../../@spk/uielements/spk-button';
import { cn } from '../../lib/utils';
const buttonVariants=cva('btn ti-btn',{variants:{variant:{default:'btn-primary ti-btn-primary-full',outline:'btn-outline ti-btn-outline-primary',ghost:'btn-ghost ti-btn-light',destructive:'btn-danger ti-btn-danger-full'},size:{default:'',sm:'btn-sm',icon:'btn-icon'}},defaultVariants:{variant:'default',size:'default'}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof buttonVariants>{asChild?:boolean;}
export const Button=React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant='default',size,asChild,type,children,...props},ref)=>{
 const classes=cn(buttonVariants({variant,size}),className);
 if(asChild)return <Slot className={classes} ref={ref} {...props}>{children}</Slot>;
 const variants={default:'primary-full',outline:'outline-primary',ghost:'light',destructive:'danger-full'};
 return <SpkButton ref={ref} variant={variants[variant||'default']} customClass={classes} buttontype={type} {...props}>{children}</SpkButton>;
});
Button.displayName='Button';
