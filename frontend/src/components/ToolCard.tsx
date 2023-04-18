import { Tool } from '@/.apis/model';
import { createSearchParams, useNavigate } from 'react-router-dom';
import Place from 'src/assets/place.svg';

export interface ToolCardProps {
  item: Tool;
  action?: 'rent' | 'details';
}

export const ToolCard: React.VFC<ToolCardProps> = (props) => {
  const { item, action = 'rent' } = props;

  const navigate = useNavigate();

  return (
    <div
      className="flex p-4 gap-x-4 text-white cursor-pointer"
      onClick={() => {
        if (action === 'rent') {
          navigate(
            '/rent?' +
              createSearchParams({
                toolId: String(item.id),
              }).toString(),
          );
        } else {
          navigate(
            '/tool?' +
              createSearchParams({
                toolId: String(item.id),
              }).toString(),
          );
        }
      }}
    >
      <img className="h-[100px] w-[100px]" src={item.photos?.[0]?.url} />
      <div>
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p>{item.introduction}</p>
        <p className="text-gray-200">
          <Place className="inline h-[20px]" /> {item.user?.zipcode} {item.user?.address}
        </p>
      </div>
    </div>
  );
};
