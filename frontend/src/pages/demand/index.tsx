import { useDemandsControllerGetAll } from '@/.apis/default/default';
import { Demand as TDemand } from '@/.apis/model';
import { PaginationControl } from '@/components/PaginationControl';
import { mapUTCToDOMDate } from '@/utils/date';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface DemandCardProps {
  demand: TDemand;
}

const DemandCard: React.VFC<DemandCardProps> = (props) => {
  const { demand } = props;

  return (
    <div className="bg-white text-primary shadow-md p-[1rem] overflow-hidden flex flex-col">
      <h4 className="font-bold">{demand.title}</h4>
      <p className="text-gray-300">
        {mapUTCToDOMDate(demand.created)} by{' '}
        <Link className="text-primary" to={`/user/profile?userId=${demand.creator?.id}`}>
          {demand.creator?.name}
        </Link>
      </p>
      <p className="flex gap-x-1 flex-wrap py-[0.5rem]">
        {demand.categories?.map((c) => (
          <span key={c.id} className="h-[24px] px-[10px] flex justify-center items-center border border-primary rounded-[12px]">{c.name}</span>
        ))}
      </p>
      <p
        className="overflow-hidden text-ellipsis flex-1 shrink min-h-[72px]"
        style={{ WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', display: '-webkit-box' }}
      >
        {demand.description}
      </p>
      <Link to="/tool/add-edit-tool">
        <button className="w-[120px] primary">LEND</button>
      </Link>
    </div>
  );
};

export const Demand: React.VFC = () => {
  const [page, setPage] = useState(1);

  const demands = useDemandsControllerGetAll({
    page,
  });

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-[2rem]">
        <h3 className="text-5xl mt-[2rem]">Tools Needed</h3>

        <div className="grid grid-cols-2 gap-4">
          {demands.data?.data.items.map((item) => (
            <DemandCard key={item.id} demand={item} />
          ))}
        </div>

        <PaginationControl meta={demands.data?.data.meta} page={page} onChangePage={setPage} />

        <Link to="/demand/add-edit-demand">
          <button className="w-[200px]">POST YOUR NEEDS</button>
        </Link>
      </div>
    </div>
  );
};
