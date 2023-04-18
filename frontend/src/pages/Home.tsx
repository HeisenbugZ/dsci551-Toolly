import { useTitle } from "@/utils/title";
import { Box } from "@mui/material";
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home: React.VFC = () => {
  useTitle('Home');

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: '#8D91B0',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: '10vw',
        paddingRight: '10vw',
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        color={'white'}
        sx={{ flexGrow: 1, paddingTop: '40px' }}
      >
        Tools rental within your neighborhood
      </Typography>

      <Box
        sx={{
          flexGrow: 8,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        }}
      >
        <Button
          variant="outlined"
          sx={{
            width: '500px',
            height: '500px',
            color: 'black',
            bgcolor: 'white',
            '&:hover': {
              backgroundColor: 'gray',
            },
          }}
          onClick={() => navigate('/tools')}
        >
          Browse Tools For Rent
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: '500px',
            height: '500px',
            color: 'black',
            bgcolor: 'white',
            '&:hover': {
              backgroundColor: 'gray',
            },
          }}
          onClick={() => navigate('/demand')}
        >
          Browse Tools Needed
        </Button>
      </Box>
    </Box>
  );
};
