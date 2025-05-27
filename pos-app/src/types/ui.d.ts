declare module '../components/ui/dialog' {
  import * as React from 'react';
  import * as DialogPrimitive from '@radix-ui/react-dialog';

  export const Dialog: typeof DialogPrimitive.Root;
  export const DialogTrigger: typeof DialogPrimitive.Trigger;
  export const DialogPortal: typeof DialogPrimitive.Portal;
  export const DialogClose: typeof DialogPrimitive.Close;
  export const DialogOverlay: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
      className?: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
  export const DialogContent: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
      className?: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
  export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DialogTitle: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
      className?: string;
    } & React.RefAttributes<HTMLHeadingElement>
  >;
  export const DialogDescription: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
      className?: string;
    } & React.RefAttributes<HTMLParagraphElement>
  >;
}

declare module '../components/ui/input' {
  import * as React from 'react';

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }

  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module '../components/ui/label' {
  import * as React from 'react';
  import * as LabelPrimitive from '@radix-ui/react-label';

  export const Label: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
      className?: string;
    } & React.RefAttributes<HTMLLabelElement>
  >;
}

declare module '../components/ui/select' {
  import * as React from 'react';
  import * as SelectPrimitive from '@radix-ui/react-select';

  export const Select: typeof SelectPrimitive.Root;
  export const SelectGroup: typeof SelectPrimitive.Group;
  export const SelectValue: typeof SelectPrimitive.Value;
  export const SelectTrigger: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
      className?: string;
    } & React.RefAttributes<HTMLButtonElement>
  >;
  export const SelectContent: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
      className?: string;
      position?: 'popper' | 'item-aligned';
    } & React.RefAttributes<HTMLDivElement>
  >;
  export const SelectLabel: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
      className?: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
  export const SelectItem: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
      className?: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
  export const SelectSeparator: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
      className?: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '../components/ui/table' {
  import * as React from 'react';

  export const Table: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableElement>
  >;
  export const TableHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableSectionElement>
  >;
  export const TableBody: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableSectionElement>
  >;
  export const TableFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableSectionElement>
  >;
  export const TableHead: React.ForwardRefExoticComponent<
    React.ThHTMLAttributes<HTMLTableCellElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableCellElement>
  >;
  export const TableRow: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableRowElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableRowElement>
  >;
  export const TableCell: React.ForwardRefExoticComponent<
    React.TdHTMLAttributes<HTMLTableCellElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableCellElement>
  >;
  export const TableCaption: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableCaptionElement> & {
      className?: string;
    } & React.RefAttributes<HTMLTableCaptionElement>
  >;
} 