import React from 'react';
// eslint-disable-next-line
import { Dialog as RadixDialog, DialogTrigger as RadixDialogTrigger, DialogContent as RadixDialogContent, DialogHeader as RadixDialogHeader } from '@radix-ui/react-dialog';

export const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <RadixDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </RadixDialog>
  );
};

export const DialogTrigger = ({ children }) => {
  return <RadixDialogTrigger asChild>{children}</RadixDialogTrigger>;
};

export const DialogContent = ({ children }) => {
  return (
    <RadixDialogContent className="fixed inset-0 z-50 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg max-w-lg mx-auto">
      {children}
    </RadixDialogContent>
  );
};

export const DialogHeader = ({ children }) => {
  return <div className="text-xl font-semibold text-gray-900 dark:text-white">{children}</div>;
};
