import { ExistsValidator } from 'src/utils/validators';

import { File } from '../entities/file.entity';

export const FileExists = ExistsValidator(File, 'File', { fieldName: 'url' });
