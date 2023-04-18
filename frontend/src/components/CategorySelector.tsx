import { useCategoriesControllerGet } from '@/.apis/default/default';
import { Control, useController } from 'react-hook-form';

export interface CategorySelectorProps {
  name: string;
  control: Control<any>;
}

export const CategorySelector: React.VFC<CategorySelectorProps> = (props) => {
  const { name, control } = props;

  const categories = useCategoriesControllerGet({
    limit: 100,
  });

  const controller = useController<{ [K in string]: number[] }>({ name, control });

  return (
    <div className="grid grid-cols-2 gap-y-2">
      {categories.data?.data.items.map((item) => {
        const selected = controller.field.value.includes(item.id);

        return (
          <div>
            <input
              type="checkbox"
              onClick={() =>
                controller.field.onChange(
                  selected
                    ? controller.field.value.filter((v) => v !== item.id)
                    : [...controller.field.value, item.id],
                )
              }
              checked={selected}
            />
            <label>{item.name}</label>
          </div>
        );
      })}
    </div>
  );
};
