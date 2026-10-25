import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { applyServerErrors } from '../lib/form';
import { useUnsavedChangesGuard } from './useUnsavedChangesGuard';

/**
 * Shared create/edit form behaviour: schema validation, saving, success toast,
 * server error mapping, redirect and the unsaved-changes guard.
 */
export function useEntityForm({ resource, record, schema, defaultValues, label, redirectTo }) {
  const navigate = useNavigate();
  const isEdit = Boolean(record);
  const create = resource.useCreate();
  const update = resource.useUpdate(record?._id);

  const form = useForm({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues });
  const hasSaved = useRef(false);
  const blocker = useUnsavedChangesGuard(form.formState.isDirty, hasSaved);

  const save = async (values) => {
    try {
      const saved = await (isEdit ? update : create).mutateAsync(values);
      hasSaved.current = true;
      toast.success(`${label} ${isEdit ? 'updated' : 'created'} successfully`);
      navigate(redirectTo(saved));
    } catch (error) {
      applyServerErrors(error, form.setError);
    }
  };
  const onSubmit = (event) => form.handleSubmit(save)(event);

  return { form, onSubmit, isEdit, blocker };
}
