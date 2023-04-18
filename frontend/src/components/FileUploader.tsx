import { usePostFiles } from '@/hooks/mutations';
import React from 'react';
import { Control, useController } from 'react-hook-form';

export interface FileUploaderProps {
  name: string;
  control: Control<any>;
}

export const FileUploader: React.VFC<FileUploaderProps> = (props) => {
  const { name, control } = props;

  const postFile = usePostFiles();

  const controller = useController({ name, control });

  return (
    <>
      <input
        type="file"
        className="text-white"
        name={name}
        onChange={async (ev) => {
          if (ev.target.files?.length) {
            const response = await postFile.mutateAsync([...ev.target.files]);
            const { url } = response[0];
            controller.field.onChange(url);
          }
        }}
        onBlur={controller.field.onBlur}
        ref={controller.field.ref}
      />
      {postFile.error && <span className="text-red-500">{(postFile.error as any)?.message}</span>}

      {controller.field.value && (
        <img className="h-[64px] w-[64px] rounded-full" src={controller.field.value} />
      )}
    </>
  );
};
