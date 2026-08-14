// Libraries
import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from "react";

export type IPictureType = {
  url: ArrayBuffer | string | null;
  filename: string;
  size: number;
};

export interface IUseForm {
  register: (name: string, options: IOptions) => IOptions | void;
  validateAll: () => void;
  formData: IFormData;
  setValue: (fieldName: string, value: IValue) => void;
  error: IError;
  isValid: boolean;
  reset: () => void;
  onMount?: () => void;
}
interface IError {
  [key: string]: IErrorTypes | string | undefined | null;
}

export interface IOptions {
  type?:
    | "text"
    | "password"
    | "number"
    | "email"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "file";
  pattern?: string;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  defaultValue?: string;
  checked?: boolean;
}

export type IFormData = {
  [property: string]: { error?: IErrorTypes; value: IValue };
};

export type IErrorTypes =
  | "Required field"
  | "Invalid value"
  | "maxLength"
  | "minLength"
  | "min"
  | "max";

export type IValue = FileList | string | number | boolean;

export interface IFormSettings extends IOptions {
  value: IValue;
  error: null | string;
  validation: boolean;
};
export interface ISchema {
  [fieldName: string]: IFormSettings;
}

function useForm(): IUseForm {
  /**
   * States
   */
  const [initialValues, setInitialValues] = useState<IFormData>({});
  const [formData, setFormData] = useState<IFormData>({});
  const [formSettings, setFormSettings] = useState<ISchema>({});
  const schemaRef = useRef<ISchema>({});

  /**
   * Validation function
   */
  const onValidate = (name: string, value: IValue): IErrorTypes | null => {
    if (!name) return null;
    if (!formSettings[name]?.validation) return null;

    const { pattern, required, maxLength, minLength, min, max } =
      formSettings[name];

    // Required
    if (required === true) {
      if (
        (!value && typeof value !== "boolean") ||
        (Array.isArray(value) && !value.length)
      ) {
        return "Required field";
      }
    }

    // Pattern
    if (pattern) {
      if (typeof value === "string") {
        if (!value.toLowerCase().match(pattern) && value !== "")
          return "Invalid value";
      }

      if (value === undefined && required === true) return "Invalid value";
    }

    // Max Length
    if (maxLength) {
      if (typeof value === "string")
        if (value.length > maxLength) return "maxLength";
    }

    // min Length
    if (minLength) {
      if (typeof value === "string")
        if (value.length < minLength) return "minLength";
      if (value === undefined) return "minLength";
    }

    // Min
    if (min) {
      if (value as number < min) return "min";
    }

    // Max
    if (max) {
      if (value as number > max) return "max";
    }

    return null;
  };

  const validateAll = () => {
    const keys = Object.keys(formData).filter(
      (find) => find && find != "Titlemessage"
    );

    keys.forEach((key) => {
      const err = onValidate(key, formData[key].value);
      setFormData((prev: IFormData) => ({
        ...prev,
        [key]: { ...prev[key], error: err || undefined },
      }));
    });
  };

  /**
   * Handlers
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target || e;
    const err = onValidate(name, files || value);

    setFormData((prev: IFormData) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: type === "checkbox" ? checked || "" : value,
        error:
          type === "checkbox"
            ? !checked
              ? "Required field"
              : undefined
            : err || undefined,
      },
    }));
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.type === "checkbox") return;

    const { name, value } = e.target;
    const err = onValidate(name, value);

    setFormData((prev: IFormData) => ({
      ...prev,
      [name]: { ...prev[name], value, error: err || undefined },
    }));
  };

  /**
   * Manually set a field's value
   */
  const setValue = (fieldName: string, value: IValue) => {
    const err = onValidate(fieldName, value);
    setFormData((prev: IFormData) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value, error: err || undefined },
    }));
  };

  /**
   * Register new input
   */
  const register = (name: string, options: IOptions) => {
    const {
      required,
      type,
      pattern,
      maxLength,
      minLength,
      defaultValue,
      min,
      max,
    } = options || {};

    const enableValidation =
      required || pattern || maxLength || minLength || min || max
        ? true
        : false;

    const value = formData[name]?.value || "";

    // Set Schema
    if (schemaRef.current) {
      schemaRef.current = {
        ...schemaRef.current,
        [name]: {
          value: defaultValue || "",
          error: null,
          required: required || false,
          pattern: pattern,
          maxLength: maxLength,
          minLength: minLength,
          min: min,
          max: max,
          validation: enableValidation,
        },
      };
    }

    return { type, name, onChange, onBlur, value };
  };

  /**
   * Reset
   */
  const reset = () => {
    setFormData(initialValues);
  };

  /**
   * Initialize schema
   */
  useEffect(() => {
    const schema = schemaRef.current;

    // Settings
    setFormSettings({ ...schema });

    const properties = Object.keys(schema);
    // Filter properties

    // Form values
    const formValues = properties.reduce(
      (obj: { [prop: string]: unknown }, key: string) => {
        const defaultValue = schema[key].value;
        const currentValue = { value: defaultValue };

        obj[key] = {
          value: schema[key].validation
            ? currentValue === undefined
              ? defaultValue
              : currentValue?.value || ""
            : "",
          error: undefined,
        };
        return obj;
      },
      {}
    );

    setInitialValues(formValues as IFormData);
    setFormData(formValues as IFormData);
  }, [schemaRef]);

  /**
   * Check form validity
   */
  let isValid = false;
  const errValue = Object.values(
    Object.keys(formData)
      .filter((find) => find)
      .reduce(
        (res: { [prop: string]: unknown }, key) => (
          (res[key] = formData[key]), res
        ),
        {}
      )
  );
  const formValue = Object.values(
    Object.keys(formData)
      .filter((find) => find)
      .reduce(
        (res: { [prop: string]: unknown }, key) => (
          (res[key] = formData[key]), res
        ),
        {}
      )
  );

  if (errValue.length && formValue.length) {
    type TErrorValue = { error: string };
    const noError = (errValue as TErrorValue[]).every(
      (err) => err.error === null || err.error === undefined
    );

    type TFormValue = { value: string };
    const newValues = (formValue as TFormValue[]).some(
      (err) => err.value === ""
    );

    isValid = !newValues ? noError : false;
  }

  /**
   * Will set all errors for each key
   */
  const error: IError = {};
  Object.keys(formData)?.forEach((data: string) => {
    error[data] = formData?.[data]?.error;
  });

  return {
    validateAll,
    formData,
    error,
    isValid,
    reset,
    register,
    setValue,
  };
}

export default useForm;
