import { useToolsControllerGetId } from '@/.apis/default/default';
import { useMe } from '@/hooks/queries';
import { Link, useSearchParams } from 'react-router-dom';

export const Tool: React.VFC = () => {
  const [params] = useSearchParams();

  const me = useMe();
  const tool = useToolsControllerGetId(Number(params.get('toolId')));
  const toolData = tool.data?.data;

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white flex flex-col gap-y-4 pb-[4rem]">
        <h2 className="text-5xl mt-[2rem]">{toolData?.name}</h2>

        <div className="flex gap-x-1">
          {toolData?.photos?.map((f, i) => (
            <img className="h-[100px]" key={i} src={f.url} />
          ))}
        </div>

        <h3 className="font-bold">Introduction</h3>
        <div>{toolData?.introduction}</div>

        <h3 className="font-bold">Categories</h3>
        <div>{toolData?.categories?.map((c) => c.name).join(', ')}</div>

        <h3 className="font-bold">Owner</h3>
        <div>
          <Link to={`/user/profile?userId=${toolData?.user?.id}`} className="underline">
            {toolData?.user?.name}
          </Link>
        </div>

        {me.data?.id === toolData?.user?.id && (
          <Link to={`/tool/add-edit-tool?toolId=${toolData?.id}`}>
            <button>EDIT</button>
          </Link>
        )}
      </div>
    </div>
  );
};
