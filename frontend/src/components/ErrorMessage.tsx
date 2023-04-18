import { FieldError } from 'react-hook-form';

export interface ErrorMessageProps {
  error?: FieldError;
}

export const ErrorMessage: React.VFC<ErrorMessageProps> = (props) => {
  const { error } = props;

  return error ? <div className="text-red-500">{error?.message}</div> : null;
};
