import {
  useToolsControllerGetId,
  useToolsControllerPatchId,
  useToolsControllerPost,
} from '@/.apis/default/default';
import { Tool } from '@/.apis/model';
import { CategorySelector } from '@/components/CategorySelector';
import { ErrorMessage } from '@/components/ErrorMessage';
import { MultiImageField, MultiImageUploader } from '@/components/MultiImageUploader';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AddEditToolContentProps {
  tool?: Tool;
}

const AddEditToolContent: React.VFC<AddEditToolContentProps> = (props) => {
  const { tool } = props;

  const navigate = useNavigate();
  const postTool = useToolsControllerPost();
  const patchTool = useToolsControllerPatchId();

  const { control, register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: tool?.name ?? '',
      introduction: tool?.introduction ?? '',
      photoUrls: tool?.photos?.map(({ url }): MultiImageField[number] => ({ url })) ?? [],
      categoryIds: tool?.categories?.map(({ id }) => id) ?? [],
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (tool) {
            await patchTool.mutateAsync({
              id: tool.id,
              data: {
                ...data,
                photoUrls: data.photoUrls.map((d) => d.url),
              },
            })
          } else {
            await postTool.mutateAsync({
              data: {
                ...data,
                photoUrls: data.photoUrls.map((d) => d.url),
              },
            });
          }

          alert('Successfully submitted!');

          navigate('/tool/user-tools');
        })}
        className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]"
      >
        <h3 className="text-5xl mt-[2rem]">{tool ? 'Edit Tool' : 'Add Tool'}</h3>

        <div className="font-bold">Name</div>
        <ErrorMessage error={formState.errors.name} />
        <input className="w-[50%]" {...register('name', { required: 'Required' })} />

        <div className="font-bold">Introduction</div>
        <ErrorMessage error={formState.errors.introduction} />
        <textarea
          className="p-[0.5rem] text-gray-400 rounded-md"
          {...register('introduction', { required: 'Required' })}
          rows={7}
        />

        <div className="font-bold">Photos</div>
        <MultiImageUploader name="photoUrls" control={control} />

        <div className="font-bold">Categories</div>
        <CategorySelector name="categoryIds" control={control} />

        <button className="bg-white" type="submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export const AddEditTool: React.VFC = () => {
  const [params] = useSearchParams();
  const toolId = params.get('toolId') ? Number(params.get('toolId')) : undefined;

  const tool = useToolsControllerGetId(toolId!, {
    query: {
      enabled: !!toolId,
    },
  });

  return tool.status === 'success' || tool.status === 'idle' ? (
    <AddEditToolContent tool={tool.data?.data} />
  ) : null;
};
