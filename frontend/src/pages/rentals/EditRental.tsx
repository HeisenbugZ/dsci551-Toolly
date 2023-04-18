import { useRentalControllerGet, useRentalControllerPatch } from '@/.apis/default/default';
import { Rental } from '@/.apis/model';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ToolCard } from '@/components/ToolCard';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { rentalStatusToString } from '@/data/rental';
import { useMe } from '@/hooks/queries';
import { useState } from 'react';
import { mapDOMDateToUTC, mapUTCToDOMDate } from '@/utils/date';

interface EditRentalContentProps {
  rental: Rental;
  refresh: () => void;
}

const EditRentalContent: React.VFC<EditRentalContentProps> = (props) => {
  const { rental, refresh } = props;

  const me = useMe();
  const patchRental = useRentalControllerPatch({
    mutation: {
      onSuccess: refresh,
    },
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      note: rental.note,
      expectedDelivery: rental.expectedDelivery ? mapUTCToDOMDate(rental.expectedDelivery) : '',
      expectedReturn: rental.expectedReturn ? mapUTCToDOMDate(rental.expectedReturn) : '',
      actualDelivery: rental.actualDelivery
        ? mapUTCToDOMDate(rental.actualDelivery)
        : dayjs().format('YYYY-MM-DD'),
      actualReturn: rental.actualReturn
        ? mapUTCToDOMDate(rental.actualReturn)
        : dayjs().format('YYYY-MM-DD'),
    },
  });

  const renderConfirmedInfo = () => {
    if (me.data?.id === rental.lender.id) {
      return (
        <div className="p-[1rem] bg-yellow-300 text-black mt-[1rem]">
          Action Required: Please send your tool to <br />
          <b>{rental.renter.name}</b>
          <br />
          <b>{rental.renter.address}</b>
          <br />
          before {mapUTCToDOMDate(rental.expectedDelivery!)}
        </div>
      );
    } else {
      return (
        <div className="p-[1rem] bg-yellow-300 text-black mt-[1rem]">
          Please be patient <br />
          Your tool is on its way, expected to be delivered by{' '}
          {mapUTCToDOMDate(rental.expectedDelivery!)}.
        </div>
      );
    }
  };

  const renderDeliveredInfo = () => {
    if (me.data?.id === rental.lender.id) {
      return (
        <div className="p-[1rem] bg-yellow-300 text-black mt-[1rem]">
          {rental.renter.name} has confirmed your delivery. <br />
          The tool is expected to be returned by {mapUTCToDOMDate(rental.expectedReturn!)}
        </div>
      );
    } else if (me.data?.id === rental.renter.id) {
      return (
        <div className="p-[1rem] bg-yellow-300 text-black mt-[1rem]">
          You have confirmed your tool's delivery. <br />
          Please return your tool to <b>{rental.lender.name}</b> by{' '}
          {mapUTCToDOMDate(rental.expectedReturn!)}
        </div>
      );
    }
  };

  const renderReturnedInfo = () => {
    return (
      <div className="p-[1rem] bg-yellow-300 text-black mt-[1rem]">
        Congratulations! The rental is complete.
      </div>
    );
  }

  const renderAwaitConfirmation = () => {
    const canConfirm = me.data?.id !== rental.initiator.id;

    const onClickConfirm = () => {
      handleSubmit(async (values) => {
        if (confirm('Do you wish to confirm? The rental will be finalized after confirmation. ')) {
          await patchRental.mutateAsync({
            id: rental.id,
            data: {
              status: 'confirmed',
              note: values.note,
              expectedDelivery: mapDOMDateToUTC(values.expectedDelivery),
              expectedReturn: mapDOMDateToUTC(values.expectedReturn),
            },
          });
          alert('Successfully confirmed!');
        }
      })();
    };

    const onClickUpdate = () => {
      handleSubmit(async (values) => {
        await patchRental.mutateAsync({
          id: rental.id,
          data: {
            note: values.note,
            expectedDelivery: mapDOMDateToUTC(values.expectedDelivery),
            expectedReturn: mapDOMDateToUTC(values.expectedReturn),
          },
        });
        alert('Successfully updated!');
      })();
    };

    return (
      <>
        <div className="font-bold">Expected Delivery Date</div>
        <ErrorMessage error={formState.errors.expectedDelivery} />
        <input
          type="date"
          className="w-[50%]"
          {...register('expectedDelivery', { required: 'Required' })}
        />

        <div className="font-bold">Expected Return Date</div>
        <ErrorMessage error={formState.errors.expectedReturn} />
        <input
          type="date"
          className="w-[50%]"
          {...register('expectedReturn', { required: 'Required' })}
        />

        <div className="font-bold">Notes</div>
        <ErrorMessage error={formState.errors.note} />
        <textarea
          {...register('note')}
          rows={7}
          className="text-slate-600 p-[1rem]"
          placeholder="Anything you want to say about the rental"
        />

        <div className="flex gap-x-4">
          <button onClick={onClickConfirm} disabled={!canConfirm}>
            {canConfirm ? 'CONFIRM' : 'AWAIT THEIR CONFIRMATION'}
          </button>

          <button onClick={onClickUpdate}>UPDATE</button>
        </div>
      </>
    );
  };

  const renderConfirmed = () => {
    const canConfirmDelivery = me.data?.id === rental.renter.id;

    const onClickConfirmDelivery = () => {
      handleSubmit(async (values) => {
        await patchRental.mutateAsync({
          id: rental.id,
          data: {
            status: 'delivered',
            actualDelivery: mapDOMDateToUTC(values.actualDelivery),
          },
        });
        alert('Successfully updated!');
      })();
    };

    return (
      <>
        <div className="font-bold">Expected Delivery Date</div>
        <div>{mapUTCToDOMDate(rental.expectedDelivery!)}</div>
        <div className="font-bold">Expected Return Date</div>
        <div>{mapUTCToDOMDate(rental.expectedReturn!)}</div>

        {canConfirmDelivery && (
          <>
            <div className="font-bold">Actual Delivery Date</div>
            <ErrorMessage error={formState.errors.actualDelivery} />
            <input
              type="date"
              className="w-[50%]"
              {...register('actualDelivery', { required: 'Required' })}
            />

            <button onClick={onClickConfirmDelivery} className="w-[240px]">
              CONFIRM DELIVERY
            </button>
          </>
        )}
      </>
    );
  };

  const renderDelivered = () => {
    const canConfirmReturn = me.data?.id === rental.lender.id;

    const onClickConfirmReturn = () => {
      handleSubmit(async (values) => {
        await patchRental.mutateAsync({
          id: rental.id,
          data: {
            status: 'returned',
            actualReturn: mapDOMDateToUTC(values.actualReturn),
          },
        });
        alert('Successfully updated!');
      })();
    };

    return (
      <>
        <div className="font-bold">Expected Delivery Date</div>
        <div>{mapUTCToDOMDate(rental.expectedDelivery!)}</div>
        <div className="font-bold">Expected Return Date</div>
        <div>{mapUTCToDOMDate(rental.expectedReturn!)}</div>
        <div className="font-bold">Actual Delivery Date</div>
        <div>{mapUTCToDOMDate(rental.actualDelivery!)}</div>

        {canConfirmReturn && (
          <>
            <div className="font-bold">Actual Return Date</div>
            <ErrorMessage error={formState.errors.actualReturn} />
            <input
              type="date"
              className="w-[50%]"
              {...register('actualDelivery', { required: 'Required' })}
            />
            <button onClick={onClickConfirmReturn} className="w-[240px]">
              CONFIRM RETURN
            </button>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]">
        {rental.status === 'confirmed' && renderConfirmedInfo()}
        {rental.status === 'delivered' && renderDeliveredInfo()}
        {rental.status === 'returned' && renderReturnedInfo()}

        <h2 className="text-5xl mt-[2rem]">Rental for "{rental.tool.name}"</h2>

        <ToolCard item={rental.tool} />

        <div className="font-bold">Lender</div>
        <div>
          <Link to={`/user/profile?userId=${rental.lender.id}`}>{rental.lender.name}</Link>
        </div>

        <div className="font-bold">Renter</div>
        <div>
          <Link to={`/user/profile?userId=${rental.renter.id}`}>{rental.renter.name}</Link>
        </div>

        <div className="font-bold">Status</div>
        <div className="font-bold italic text-gray-200">{rentalStatusToString[rental.status]}</div>

        {rental.status === 'await_confirmation' && renderAwaitConfirmation()}
        {rental.status === 'confirmed' && renderConfirmed()}
        {rental.status === 'delivered' && renderDelivered()}
      </div>
    </div>
  );
};

export const EditRental: React.VFC = () => {
  const [params] = useSearchParams();

  const rental = useRentalControllerGet(Number(params.get('rentalId')));

  const [version, setVersion] = useState(0);

  return rental.data?.data ? (
    <EditRentalContent
      key={version}
      rental={rental.data.data}
      refresh={async () => {
        await rental.refetch();
        setVersion((v) => v + 1);
      }}
    />
  ) : null;
};
