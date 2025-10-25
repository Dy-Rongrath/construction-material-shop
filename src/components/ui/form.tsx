'use client';

import React from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <form className={className} onSubmit={form.handleSubmit(onSubmit)} {...props}>
      {children}
    </form>
  );
}

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  render: (
    field: ReturnType<UseFormReturn<T>['register']> & {
      value: unknown;
      error?: string;
    }
  ) => React.ReactNode;
}

export function FormField<T extends FieldValues>({ form, name, render }: FormFieldProps<T>) {
  const error = form.formState.errors[name]?.message as string | undefined;
  const field = form.register(name);
  return render({
    ...field,
    value: form.watch(name),
    error,
  });
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export function FormLabel({ className, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function FormControl({ ...props }: FormControlProps) {
  return <div {...props} />;
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
}

export function FormMessage({ className, error, children, ...props }: FormMessageProps) {
  const body = error || children;

  if (!body) return null;

  return (
    <p className={cn('text-sm font-medium text-red-500', className)} {...props}>
      {body}
    </p>
  );
}

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FormDescription({ className, ...props }: FormDescriptionProps) {
  return <p className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />;
}
