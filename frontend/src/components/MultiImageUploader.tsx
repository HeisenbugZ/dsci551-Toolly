import { usePostFiles } from '@/hooks/mutations';
import { Control, useController } from 'react-hook-form';
import selectFiles from 'select-files';

export type MultiImageField = {
  file?: File;
  url: string;
}[];

export interface MultiImageUploaderProps {
  name: string;
  control: Control<any>;
}

export const MultiImageUploader: React.VFC<MultiImageUploaderProps> = (props) => {
  const { name, control } = props;

  const postFile = usePostFiles();
  const controller = useController<{ [K in string]: MultiImageField }>({ name, control });

  return (
    <div>
      <div className="flex gap-x-4 mb-[1rem]">
        {controller.field.value.map(({ url }) =>  <img className="h-[128px]" key={url} src={url} />)}
      </div>
      <button
        ref={controller.field.ref}
        type="button"
        className="!bg-white"
        onClick={async () => {
          const files = await selectFiles({ accept: 'images/*' });
          if (files) {
            const response = await postFile.mutateAsync([...files]);
            controller.field.onChange([
              ...controller.field.value,
              ...[...files].map((file, i) => ({
                file,
                url: response[i].url,
              }))
            ]);
            controller.field.onBlur();
          }
        }}
      >
        SELECT FILES
      </button>
      {postFile.isLoading && <span className="text-sm ml-[1rem]">Uploading...</span>}
    </div>
  );
};
