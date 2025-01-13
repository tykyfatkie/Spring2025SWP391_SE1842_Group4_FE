import React, { useEffect, useCallback, PropsWithChildren } from 'react';
import { Form, Select, DropdownItemProps, Checkbox } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';

import { FormField } from '@archive/app/models/form-field';
import LocationSection from './LocationSection';
import { Location as ILocation } from './Location';

interface Props<T extends object> {
  formFields: FormField<T>[];
  onSubmit: (data: T) => void;
  defaultValues?: T;
  loading?: boolean;
  confirmButtonLabel?: string;
  errors?: {
    [k: string]: string | string[];
  };
}

const SimpleForm: <T extends object>(
  props: PropsWithChildren<Props<T>>,
) => JSX.Element = (props) => {
  const { formFields, onSubmit, defaultValues } = props;

  const {
    handleSubmit,
    register,
    control,
    errors,
    setError,
    clearErrors,
  } = useForm({
    defaultValues,
  });

  const { errors: propErrors } = props;
  useEffect(() => {
    if (propErrors) {
      clearErrors();
      Object.keys(propErrors).forEach((name) => {
        const fieldError = propErrors[name];
        const message = Array.isArray(fieldError)
          ? fieldError.join('; ')
          : fieldError;
        setError(name, { type: 'manual', message });
      });
    }
  }, [setError, clearErrors, propErrors]);

  // #region input
  type T = Parameters<typeof onSubmit>[0];
  type InputType = FormField<T>['inputType'];
  const input = useCallback(
    (
      name: keyof Partial<T>,
      label?: string,
      placeholder?: string,
      hidden?: boolean,
      inputType?: InputType,
      required?: boolean,
    ) => (
      <div
        key={`${name}`}
        className={`field
          ${hidden ? 'd-none' : ''}
          ${required ? 'required' : ''}
          ${errors[`${name}`] && 'error'}`}
      >
        <label htmlFor={`${name}`}>{label}</label>
        <input
          id={`${name}`}
          name={`${name}`}
          ref={register}
          placeholder={placeholder}
          type={inputType ?? 'text'}
        />
        {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
          <div className="ui pointing above prompt label">
            {propErrors?.[`${name}`]}
          </div>
        )}
      </div>
    ),
    [register, errors, propErrors],
  );
  // #endregion

  // #region textarea
  const textarea = useCallback(
    (
      name: keyof Partial<T>,
      label?: string,
      placeholder?: string,
      required?: boolean,
    ) => (
      <div
        key={`${name}`}
        className={`field
          ${required ? 'required' : ''}
          ${errors[`${name}`] && 'error'}`}
      >
        <label htmlFor={`${name}`}>{label}</label>
        <textarea
          id={`${name}`}
          name={`${name}`}
          ref={register}
          placeholder={placeholder}
        />
        {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
          <div className="ui pointing above prompt label">
            {propErrors?.[`${name}`]}
          </div>
        )}
      </div>
    ),
    [register, errors, propErrors],
  );
  // #endregion

  // #region select
  const select = useCallback(
    (
      name: keyof Partial<T>,
      options: DropdownItemProps[],
      label?: string,
      multiple?: boolean,
      hidden?: boolean,
      required?: boolean,
    ) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        render={({ onChange, onBlur, value }): React.ReactElement => {
          let multipleValue = [];
          if (multiple && value) {
            multipleValue = value;
          }
          return (
            <div
              key={`${name}`}
              className={`field
                ${required ? 'required' : ''}
                ${hidden ? 'd-none' : ''}
                ${errors[`${name}`] && 'error'}`}
            >
              <label htmlFor={`${name}`}>{label}</label>
              <Select
                fluid
                search
                deburr
                clearable
                multiple={multiple}
                options={options}
                value={multiple ? multipleValue : value}
                onChange={(e, d): void => onChange(d.value)}
                onBlur={onBlur}
              />
              {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
                <div className="ui pointing above prompt label">
                  {propErrors?.[`${name}`]}
                </div>
              )}
            </div>
          );
        }}
      />
    ),
    [control, errors, propErrors],
  );
  // #endregion

  // #region location
  const location = useCallback(
    (name: keyof Partial<T>, locationData?: Location) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        render={({ onChange }): React.ReactElement => {
          return <LocationSection data={locationData} onChange={onChange} />;
        }}
      />
    ),
    [control],
  );
  // #endregion

  // #region checkbox
  const checkbox = useCallback(
    (name: keyof Partial<T>, label?: string, required?: boolean) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        render={({ onChange, value }): React.ReactElement => (
          <div
            key={`${name}`}
            className={`field
              ${required ? 'required' : ''}
              ${errors[`${name}`] && 'error'}`}
          >
            <Checkbox
              label={label}
              checked={value || false}
              onChange={(e, { checked }): void => onChange(checked)}
            />
            {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
              <div className="ui pointing above prompt label">
                {propErrors?.[`${name}`]}
              </div>
            )}
          </div>
        )}
      />
    ),
    [control, errors, propErrors],
  );
  // #endregion

  const { loading, confirmButtonLabel } = props;
  return (
    <Form loading={loading} onSubmit={handleSubmit((d) => onSubmit(d as T))}>
      {formFields.map((f) => {
        switch (f.type) {
          case 'location':
            return location(f.name, f?.locationData);
          case 'select':
            return select(
              f.name,
              f.options ?? [],
              f.label,
              f.multiple,
              f.hidden,
              f.required,
            );
          case 'checkbox':
            return checkbox(f.name, f.label, f.required);
          case 'textarea':
            return textarea(f.name, f.label, f.placeholder, f.required);
          case 'input':
          default:
            return input(
              f.name,
              f.label,
              f.placeholder,
              f.hidden,
              f.inputType,
              f.required,
            );
        }
      })}
      {/* <Form.Button primary content={confirmButtonLabel ?? 'Xác nhận'} /> */}
    </Form>
  );
};

export type Location = ILocation;
export default SimpleForm;
