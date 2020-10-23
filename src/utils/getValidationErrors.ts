import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}
export default function getValidationErrors(err: ValidationError): Errors  {
  return err.inner.reduce<Errors>((acc, value) => {
    acc[value.path] = value.message;
    return acc;
  }, {});
}
