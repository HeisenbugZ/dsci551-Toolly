import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { MutationAlert } from '@/components/MutationAlert';
import { useLogin } from '@/hooks/mutations';
import { auth } from '@/utils/auth';
import { useTitle } from '@/utils/title';

export const Login = () => {
  useTitle('Login');

  const login = useLogin();

  const [searchParams] = useSearchParams();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: import.meta.env.VITE_APP_EMAIL || searchParams.get('email'),
      password: import.meta.env.VITE_APP_PASSWORD ||  '',
    },
  });

  const onSubmit = async (data: any) => {
    const { token } = await login.mutateAsync(data);
    auth.setToken(token);
    navigate('/home');
  };

  const navigate = useNavigate();

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {searchParams.get('action') === 'signed_up' && (
        <div className="alert mb-4">Your account is created successfully. Please log in.</div>
      )}

      <MutationAlert mutation={login} />
      <label htmlFor="email" className="mb-2">
        Email
      </label>
      <input className="mb-4" {...register('email')} required />
      <label htmlFor="password" className="mb-2">
        Password
      </label>
      <input className="mb-4" {...register('password')} type="password" required />

      <button className="self-center">LOG IN</button>

      <div className="text-sm text-white text-center mt-4">
        Don't have an account yet?{' '}
        <Link className="underline" to="/auth/signup">
          Sign up
        </Link>{' '}
        today
      </div>
    </form>
  );
};
