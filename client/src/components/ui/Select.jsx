import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/cn';
import { fieldClasses } from './styles';

/**
 * Accessible, fully styled dropdown (keyboard, typeahead and screen reader support from Radix).
 * Options: { value, label, description?, disabled? }.
 */
export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled,
  className,
  ref,
  ...triggerProps
}) {
  return (
    <RadixSelect.Root value={value ?? ''} onValueChange={onValueChange} disabled={disabled}>
      <RadixSelect.Trigger
        ref={ref}
        {...triggerProps}
        className={cn(
          fieldClasses,
          'flex items-center justify-between gap-2 text-left data-placeholder:text-ink-subtle',
          '[&>span]:truncate',
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-h-[min(22rem,var(--radix-select-content-available-height))] w-(--radix-select-trigger-width) min-w-48 overflow-hidden rounded-xl border border-line bg-surface shadow-pop motion-safe:animate-pop-in"
        >
          <RadixSelect.ScrollUpButton className="flex h-7 items-center justify-center text-ink-subtle">
            <ChevronUp className="size-4" aria-hidden="true" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="p-1.5">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'relative flex cursor-pointer select-none flex-col rounded-lg py-2 pr-3 pl-9 text-sm text-ink outline-none',
                  'data-highlighted:bg-brand-50 data-highlighted:text-brand-900 data-[state=checked]:font-semibold',
                  'data-disabled:cursor-not-allowed data-disabled:opacity-50',
                )}
              >
                <RadixSelect.ItemIndicator className="absolute top-2.5 left-3 text-brand-600">
                  <Check className="size-4" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                {option.description && (
                  <span className="mt-0.5 text-xs font-normal text-ink-subtle">
                    {option.description}
                  </span>
                )}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex h-7 items-center justify-center text-ink-subtle">
            <ChevronDown className="size-4" aria-hidden="true" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
