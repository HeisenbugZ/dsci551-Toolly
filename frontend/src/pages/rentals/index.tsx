import { useRentalControllerGetOwn } from '@/.apis/default/default';
import { rentalStatusToString } from '@/data/rental';
import { Rental } from '@apis/model/rental';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface RentalCardProps {
  rental: Rental;
}

const RentalCard: React.VFC<RentalCardProps> = (props) => {
  const { rental } = props;

  const photo = rental.tool.photos?.[0];

  return (
    <div className="p-[1rem] bg-white text-gray-700 shadow flex gap-x-[2rem]">
      {photo && (
        <Link to={`/tool?toolId=${rental.tool.id}`}>
          <img src={photo.url} className="w-[128px] h-[128px] object-cover" />
        </Link>
      )}

      <div className="flex flex-col flex-1">
        <h4 className="font-bold">
          {rental.tool.name} -{' '}
          <span className="text-primary">{rentalStatusToString[rental.status]}</span>
        </h4>

        <div>
          Lender: <Link to={`/user/profile?userId=${rental.lender.id}`}>{rental.lender.name}</Link>
        </div>
        <div>
          Renter: <Link to={`/user/profile?userId=${rental.renter.id}`}>{rental.renter.name}</Link>
        </div>

        <div>Created At: {dayjs(rental.created).format('YYYY/MM/DD HH:mm')}</div>

        <div>Updated At: {dayjs(rental.updated).format('YYYY/MM/DD HH:mm')}</div>
      </div>

      <div className="flex items-end">
        <Link to={`/rentals/edit-rental?rentalId=${rental.id}`}>
          <button className="primary">MANAGE</button>
        </Link>
      </div>
    </div>
  );
};

export const Rentals: React.VFC = () => {
  const rentalsRenters = useRentalControllerGetOwn({
    type: 'renter',
    limit: 5,
  });

  const rentalsLenders = useRentalControllerGetOwn({
    type: 'lender',
    limit: 5,
  });

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]">
        <h3 className="text-5xl mt-[2rem]">Renting</h3>

        {rentalsRenters.data?.data.items.map((item) => (
          <RentalCard key={item.id} rental={item} />
        ))}

        {rentalsRenters.data?.data.items.length === 0 && <>You haven't borrowed any tools</>}

        <h3 className="text-5xl mt-[2rem]">Lending</h3>

        {rentalsLenders.data?.data.items.map((item) => (
          <RentalCard key={item.id} rental={item} />
        ))}

        {rentalsLenders.data?.data.items.length === 0 && <>You haven't lent any tools</>}
      </div>
    </div>
  );
};
