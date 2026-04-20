//✅ Client Component — usa useReducer, useCallback
'use client';

import { useReducer, useCallback } from 'react';

type FormValues = Record<string, string | boolean>;
type FormErrors = Record<string, string>;
type FormTouched = Record<string, boolean>;

interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
}

type FormAction =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | boolean;
    }
  | {
      type: 'SET_ERRORS';
      payload: FormErrors;
    }
  | {
      type: 'SET_TOUCHED';
      field: string;
    }
  | {
      type: 'SET_SUBMITTING';
      payload: boolean;
    }
  | {
      type: 'RESET';
      payload?: FormValues;
    };

interface UseFormParams {
  initialValues?: FormValues;
  validate?: (values: FormValues) => FormErrors;
  onSubmit?: (values: FormValues) => Promise<void>;
}

const initialState = (initialValues: FormValues = {}): FormState => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
});

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: '',
        },
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };

    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'RESET':
      return initialState(action.payload || {});

    default:
      return state;
  }
}

export function useForm({
  initialValues = {},
  validate = () => ({}),
  onSubmit = async () => {},
}: UseFormParams = {}) {
  const [state, dispatch] = useReducer(
    formReducer,
    initialState(initialValues),
  );

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;

      let fieldValue: string | boolean = value;

      if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
        fieldValue = e.target.checked;
      }

      dispatch({
        type: 'SET_FIELD',
        field: name,
        value: fieldValue,
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name } = e.target;

      dispatch({
        type: 'SET_TOUCHED',
        field: name,
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors = validate(state.values);

      if (Object.keys(errors).length > 0) {
        dispatch({
          type: 'SET_ERRORS',
          payload: errors,
        });
        return;
      }

      dispatch({
        type: 'SET_SUBMITTING',
        payload: true,
      });

      try {
        await onSubmit(state.values);

        dispatch({
          type: 'RESET',
          payload: initialValues,
        });
      } catch (error: unknown) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            submit:
              error instanceof Error
                ? error.message
                : 'Ocurrió un error al enviar el formulario',
          },
        });
      } finally {
        dispatch({
          type: 'SET_SUBMITTING',
          payload: false,
        });
      }
    },
    [state.values, validate, onSubmit, initialValues],
  );

  const resetForm = useCallback(() => {
    dispatch({
      type: 'RESET',
      payload: initialValues,
    });
  }, [initialValues]);

  const setValues = useCallback((values: FormValues) => {
    dispatch({
      type: 'RESET',
      payload: values,
    });
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
}