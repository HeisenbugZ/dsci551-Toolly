import { useDemandsControllerGetId, useDemandsControllerPost } from '@/.apis/default/default';
import { Demand } from '@/.apis/model';
import { CategorySelector } from '@/components/CategorySelector';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AddEditDemandContentProps {
  item?: Demand;
}

const AddEditDemandContent: React.VFC<AddEditDemandContentProps> = (props) => {
  const { item } = props;

  const postDemand = useDemandsControllerPost();

  const navigate = useNavigate();

  const { control, register, handleSubmit, formState } = useForm({
    defaultValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      categoryIds: item?.categories?.map(({ id }) => id) ?? [],
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          await postDemand.mutateAsync({ data });
          alert('Successfully posted your request!');
          navigate('/demand');
        })}
        className="mx-auto max-w-5xl text-white flex flex-col gap-y-4"
      >
        <h3 className="text-5xl mt-[2rem]">{item ? 'Edit Demand' : 'Add Demand'}</h3>

        <div className="font-bold">Title</div>
        <ErrorMessage error={formState.errors.title} />
        <input className="w-[50%]" {...register('title', { required: 'Required' })} />

        <div className="font-bold">Description</div>
        <ErrorMessage error={formState.errors.description} />
        <textarea
          rows={7}
          className="text-black rounded-md p-[0.5rem]"
          {...register('description', { required: 'Required' })}
        />

        <div className="font-bold">Categories</div>
        <CategorySelector name="categoryIds" control={control} />

        <button className="bg-white w-[120px]" type="submit">
          POST
        </button>
      </form>
    </div>
  );
};

export const AddEditDemand: React.VFC = () => {
  const [params] = useSearchParams();
  const demandId = params.get('demandId') ? Number(params.get('demandId')) : undefined;

  const demand = useDemandsControllerGetId(demandId!, {
    query: {
      enabled: !!demandId,
    },
  });

  return demand ? <AddEditDemandContent item={demand.data?.data} /> : null;
};
