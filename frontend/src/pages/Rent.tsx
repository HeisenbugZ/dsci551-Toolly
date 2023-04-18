import { useRentalControllerPost, useToolsControllerGetId } from '@/.apis/default/default';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useMe } from '@/hooks/queries';
import { mapDOMDateToUTC } from '@/utils/date';
import Place from 'src/assets/place.svg';

export const Rent: React.VFC = () => {
  const [params] = useSearchParams();
  const toolId = Number(params.get('toolId'));

  const me = useMe();
  const tool = useToolsControllerGetId(toolId);
  const navigate = useNavigate();
  const toolData = tool.data?.data;

  const postRental = useRentalControllerPost();

  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      note: '',
      expectedDelivery: '',
      expectedReturn: '',
    },
  });

  const onSubmit = async () => {
    const values = getValues();

    await postRental.mutateAsync({
      data: {
        note: values.note,
        tool: toolId,
        lender: toolData?.user?.id!,
        renter: me?.data?.id!,
        expectedDelivery: mapDOMDateToUTC(values.expectedDelivery),
        expectedReturn: mapDOMDateToUTC(values.expectedReturn),
      },
    });

    alert(
      'Thank you! Your rental request has been sent. Please wait for the lender to process your request.',
    );
    navigate('/rentals');
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]"
      >
        <h2 className="text-5xl mt-[2rem]">Renting "{toolData?.name}"</h2>

        <a className="underline" href={`/tool?toolId=${toolId}`} target="_blank">
          <img
            className="block object-cover h-[128px] w-[128px]"
            src={toolData?.photos?.[0]?.url}
          />
        </a>

        <div>
          <Place className="inline h-[20px]" /> {toolData?.user?.zipcode} {toolData?.user?.address}
        </div>

        <div>
          Name:
          {toolData?.name}
        </div>

        <div>
          Introduction:
          {toolData?.introduction}
        </div>

        <div>
          Categories:
          {toolData?.categories?.map((c) => c.name).join(',')}
        </div>

        <div>
          <a className="underline" href={`/tool?toolId=${toolId}`} target="_blank">
            More details...
          </a>
        </div>

        <div>
          Owner:
          <Link to={`/user/profile?userId=${toolData?.user?.id}`}>{toolData?.user?.name}</Link>
        </div>

        <div>Expected Delivery Date</div>
        <ErrorMessage error={formState.errors.expectedDelivery} />
        <input
          type="date"
          className="w-[50%]"
          {...register('expectedDelivery', { required: 'Required' })}
        />

        <div>Expected Return Date</div>
        <ErrorMessage error={formState.errors.expectedReturn} />
        <input
          type="date"
          className="w-[50%]"
          {...register('expectedReturn', { required: 'Required' })}
        />

        <div>Note:</div>

        <textarea
          rows={10}
          className="text-slate-600 p-[1rem]"
          placeholder="Anything you want to say to the lender"
          {...register('note')}
        />

        <button type="submit" className="w-[100px] bg-white">
          Submit
        </button>
      </form>
    </div>
  );
};
