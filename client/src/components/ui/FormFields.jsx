import { Controller, get, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { CharCount, FormField, Input, Textarea } from './FormField';
import { Select } from './Select';

function WatchedCount({ name, max }) {
  return <CharCount value={useWatch({ name }) ?? ''} max={max} />;
}

/**
 * A text, number or multi-line field bound to the surrounding react-hook-form context.
 * Number fields are parsed as numbers so the shared schema can validate them.
 */
export function TextField({
  name,
  label,
  hint,
  required = false,
  number = false,
  multiline = false,
  showCount = false,
  className,
  ...inputProps
}) {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });
  const registration = register(name, number ? { valueAsNumber: true } : undefined);
  const Control = multiline ? Textarea : Input;

  return (
    <FormField
      id={name}
      label={label}
      hint={hint}
      required={required}
      error={get(errors, name)?.message}
      className={className}
      counter={showCount && <WatchedCount name={name} max={inputProps.maxLength} />}
    >
      {(a11y) => (
        <Control
          type={number ? 'number' : 'text'}
          inputMode={number ? 'numeric' : undefined}
          step={number ? 1 : undefined}
          {...a11y}
          {...registration}
          {...inputProps}
        />
      )}
    </FormField>
  );
}

/** A styled dropdown bound to the form. */
export function SelectField({
  name,
  label,
  hint,
  required = false,
  className,
  onValueChange,
  ...selectProps
}) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormField
          id={name}
          label={label}
          hint={hint}
          required={required}
          error={fieldState.error?.message}
          className={className}
        >
          {(a11y) => (
            <Select
              {...a11y}
              {...selectProps}
              ref={field.ref}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value);
              }}
            />
          )}
        </FormField>
      )}
    />
  );
}
