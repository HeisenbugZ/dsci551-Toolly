import { User } from '@apis/model';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useMe } from '@/hooks/queries';
import { useForm } from 'react-hook-form';
import { FileUploader } from '@/components/FileUploader';
import { useUsersControllerPatchMe } from '@/.apis/default/default';
import { AxiosError } from 'axios';

interface ProfileFormProps {
  user: User;
}

const ProfileForm: React.VFC<ProfileFormProps> = (props) => {
  const { user } = props;

  const { control, register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: user.name,
      zipcode: user.zipcode,
      address: user.address,
      profilePhotoUrl: user.profilePhoto?.url ?? '',
    },
  });

  const patchMe = useUsersControllerPatchMe();

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await patchMe.mutateAsync({
              data: {
                ...data,
                profilePhotoUrl: data.profilePhotoUrl || undefined,
              },
            });
            alert('Successfully updated your profile!');
          } catch (e) {
            if (e instanceof Error) {
              alert((e as AxiosError).response?.data.message ?? String(e));
            } else {
              throw e;
            }
          }
        })}
        className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]"
      >
        <h2 className="text-5xl mt-[2rem]">User Profile</h2>

        <div>Name</div>
        <ErrorMessage error={formState.errors.name} />
        <input className="w-[50%]" {...register('name', { required: 'Required' })} />

        <div>Zipcode</div>
        <ErrorMessage error={formState.errors.zipcode} />
        <input className="w-[50%]" {...register('zipcode', { required: 'Required' })} />

        <div>Address</div>
        <ErrorMessage error={formState.errors.address} />
        <input className="w-[50%]" {...register('address', { required: 'Required' })} />

        <div>Profile Photo</div>
        <ErrorMessage error={formState.errors.profilePhotoUrl} />
        <FileUploader control={control} name="profilePhotoUrl" />

        <button type="submit" className="w-[200px] bg-white">
          UPDATE PROFILE
        </button>
      </form>
    </div>
  );
};

export const EditProfile: React.VFC = () => {
  const me = useMe();

  return me.data ? <ProfileForm user={me.data} /> : null;
};
