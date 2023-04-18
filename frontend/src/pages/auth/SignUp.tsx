import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { MutationAlert } from '@/components/MutationAlert';
import { useRegister } from '@/hooks/mutations';

import { useTitle } from '@/utils/title';

export const SignUp = () => {
  useTitle('Sign up');

  const registerMutation = useRegister();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await registerMutation.mutateAsync(data);
    navigate(`/auth/login?action=signed_up&email=${data.email}`);
  };

  const navigate = useNavigate();

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <MutationAlert mutation={registerMutation} />
      <label htmlFor="name" className="mb-2">
        Name
      </label>
      <input className="mb-4" {...register('name')} required />

      <label htmlFor="email" className="mb-2">
        Email
      </label>
      <input className="mb-4" {...register('email')} type="email" required />

      <label htmlFor="address" className="mb-2">
        Zipcode
      </label>
      <input className="mb-4" {...register('zipcode')} type="zipcode" required />

      <label htmlFor="address" className="mb-2">
        Address
      </label>
      <input className="mb-4" {...register('address')} type="address" required />

      <label htmlFor="password" className="mb-2">
        Password
      </label>
      <input className="mb-4" {...register('password')} type="password" required />

      <button className="self-center">SIGN UP</button>
    </form>
  );
};
