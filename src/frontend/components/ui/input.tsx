import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
export const Input=forwardRef<HTMLInputElement,React.InputHTMLAttributes<HTMLInputElement>>(({className,...props},ref)=><input ref={ref} className={cn('input ti-form-control form-control',className)} {...props}/>);
Input.displayName='Input';
