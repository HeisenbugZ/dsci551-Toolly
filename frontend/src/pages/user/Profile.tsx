import { useToolsControllerGet, useUsersControllerGetId } from '@/.apis/default/default';
import { PaginationControl } from '@/components/PaginationControl';
import { ToolCard } from '@/components/ToolCard';
import { useSearchParams } from 'react-router-dom';

export const Profile: React.VFC = () => {
  const [params, setParams] = useSearchParams();
  const userId = Number(params.get('userId'));
  const page = params.get('page') ? Number(params.get('page')) : 1;

  const user = useUsersControllerGetId(userId);

  const tools = useToolsControllerGet({
    user: userId,
    page,
  });

  const userData = user.data?.data;

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]">
        <h2 className="text-5xl mt-[2rem]">{userData?.name}</h2>

        {userData?.profilePhoto && (
          <img className="h-[64px] w-[64px] rounded-full" src={userData?.profilePhoto.url} />
        )}

        <div>
          Email:
          <a href={`mailto:${userData?.email}`}>{userData?.email}</a>
        </div>
        <div>
          Address:
          {userData?.address}
        </div>

        <h3 className="font-bold">{userData?.name}'s tools</h3>

        <div className="grid grid-cols-2 gap-4">
          {tools.data?.data.items.map((item) => (
            <ToolCard key={item.id} item={item} />
          ))}
        </div>

        <PaginationControl
          meta={tools.data?.data.meta}
          page={page}
          onChangePage={(page) =>
            setParams({
              userId: String(userId),
              page: String(page),
            })
          }
        />
      </div>
    </div>
  );
};
