import React from 'react';

export interface Field {
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'file' | 'hidden';
  options?: string[];
  colSpan?: 1 | 2;
}

export interface InfoCardData {
  number: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  onClick?: () => void;
  fields: Field[];
  handleSubmit: (e: React.FormEvent) => void;
  handleFieldChange: (fieldIndex: number, value: string) => void;
}

export interface InfoCardProps {
  number: number;
  title: string;
  icon: React.ReactNode;
  description: string;
  isSelected: boolean;
  onClick?: () => void;
  fields: Field[];
  handleSubmit: (e: React.FormEvent) => void;
  handleFieldChange: (fieldIndex: number, value: string) => void;
}
