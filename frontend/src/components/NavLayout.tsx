import Logo from '@/assets/Logo.svg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Divider, Box, Toolbar, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Outlet } from 'react-router-dom';
import { useMe } from '@/hooks/queries';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export const NavLayout: React.VFC = () => {
  const me = useMe();
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: {
      zipcode: params.get('zipcode'),
    },
  });

  useEffect(() => {
    if (me.data && !params.get('zipcode')) {
      setValue('zipcode', me.data.zipcode);
    }
  }, [me.data]);

  return (
    <div className="min-h-screen bg-primary">
      <Toolbar
        sx={{
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            heigh: '100%',
            width: '100%',
            flexGrow: '1',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            marginTop: '10px',
          }}
        >
          {me.isIdle && (
            <>
              <Link to="/auth/login">
                <Button sx={{ color: 'white', boxShadow: 0 }}>Login</Button>
              </Link>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />
              <Link to="/auth/signup">
                <Button sx={{ color: 'white', boxShadow: 0 }}>Sign Up</Button>
              </Link>
            </>
          )}
          {me.isSuccess && (
            <>
              <Link to="/user/edit-profile" className="mr-[1rem] pt-[0.25rem]">
                {me.data.email}
              </Link>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />
              <Link to="/tool/user-tools">
                <Button sx={{ color: 'white', boxShadow: 0 }}>My Tools</Button>
              </Link>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />
              <Link to="/rentals">
                <Button sx={{ color: 'white', boxShadow: 0 }}>My Rentals</Button>
              </Link>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'white' }} />
              <Link to="/auth/login">
                <Button sx={{ color: 'white', boxShadow: 0 }}>Log out</Button>
              </Link>
            </>
          )}
        </Box>
        <Box
          sx={{
            flexGrow: '3',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            height: '100%',
            width: '100%',
          }}
        >
          <Button sx={{ color: 'white', boxShadow: 0 }} href="/home">
            <Logo />
          </Button>
          <Link to="/tools">
            <Button sx={{ color: 'white', boxShadow: 0 }}>Rent a Tool</Button>
          </Link>
          <Link to="/tool/user-tools">
            <Button sx={{ color: 'white', boxShadow: 0 }}>Lend your Tool</Button>
          </Link>
          <Link to="/demand">
            <Button sx={{ color: 'white', boxShadow: 0 }}>See Tools Needed</Button>
          </Link>
          <form
            onSubmit={handleSubmit(({ zipcode }) => navigate(`/tools?zipcode=${zipcode}`))}
            className="flex justify-end text-white"
          >
            <input {...register('zipcode')} className="mr-[1rem]" />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </form>
        </Box>
      </Toolbar>
      <Outlet />
    </div>
  );
};
