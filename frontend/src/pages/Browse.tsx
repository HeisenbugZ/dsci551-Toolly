import React, { useMemo, useState } from 'react';
import { ListSubheader, Typography } from '@mui/material';
import { useTitle } from '@/utils/title';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { useCategoriesControllerGet, useToolsControllerGet } from '@apis/default/default';
import { ToolCard } from '@/components/ToolCard';
import { PaginationControl } from '@/components/PaginationControl';
import { Link, useSearchParams } from 'react-router-dom';
import { Category } from '@/.apis/model';

export const Browse: React.VFC = () => {
  useTitle('Browse');

  const [params] = useSearchParams();

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<number | undefined>();

  const tools = useToolsControllerGet({
    page,
    category,
    zipcode: params.get('zipcode') ?? undefined,
  });

  const categories = useCategoriesControllerGet({
    limit: 100,
  });

  const groups = useMemo((): Record<string, Category[]> => {
    const r: Record<string, Category[]> = {};

    for (const d of categories.data?.data.items ?? []) {
      r[d.group] = [...(r[d.group] ?? []), d];
    }

    return r;
  }, [categories.data]);

  return (
    <div>
      <div className="mx-auto max-w-5xl text-white">
        <div>
          <Typography variant="h4" component="h2" color={'white'} sx={{ paddingTop: '20px' }}>
            Browse Tools For Rent
          </Typography>

          <div className="flex gap-x-[1rem] items-center">
            <FormControl sx={{ m: 1, minWidth: 120, bgcolor: 'white', borderRadius: '5px' }}>
              <InputLabel htmlFor="grouped-select">Categories</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : undefined)}
                id="grouped-select"
                label="Grouping"
              >
                {Object.entries(groups).flatMap(([group, categories]) => [
                  <ListSubheader>{group}</ListSubheader>,
                  ...categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  )),
                ])}
                <MenuItem value={undefined}>ALL</MenuItem>
              </Select>
            </FormControl>
            <div className="flex-1" />
            <Link to="/demand/add-edit-demand">
              <button>POST YOUR NEEDS</button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4">
          {tools.data?.data.items.map((item) => (
            <ToolCard key={item.id} item={item} />
          ))}
        </div>

        <PaginationControl meta={tools.data?.data.meta} page={page} onChangePage={setPage} />
      </div>
    </div>
  );
};
