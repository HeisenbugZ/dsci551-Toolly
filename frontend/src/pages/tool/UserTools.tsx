import { useToolsControllerGet, useUsersControllerGetMe } from '@/.apis/default/default';
import { MultiImageUploader } from '@/components/MultiImageUploader';
import { PaginationControl } from '@/components/PaginationControl';
import { ToolCard } from '@/components/ToolCard';
import { useMe } from '@/hooks/queries';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const UserTools: React.VFC = () => {
  const user = useMe();

  const [page, setPage] = useState(1);

  const tools = useToolsControllerGet(
    {
      user: user.data?.id,
      page,
    },
    {
      query: {
        enabled: !!user.data
      },
    },
  );

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]">
        <h3 className="text-5xl mt-[2rem]">My Tools</h3>

        <div className="grid grid-cols-2 gap-4">
          {tools.data?.data.items.map((item) => (
            <ToolCard action="details" key={item.id} item={item} />
          ))}
          {tools.data?.data.items.length === 0 && (
            <>Click 'ADD TOOL' to add your first tool here!</>
          )}
        </div>

        {(tools.data?.data.meta.totalPages ?? 0) > 0 && (
          <PaginationControl onChangePage={setPage} page={page} meta={tools.data?.data.meta} />
        )}

        <Link to="/tool/add-edit-tool">
          <button className="w-[120px]">ADD TOOL</button>
        </Link>
      </div>
    </div>
  );
};
