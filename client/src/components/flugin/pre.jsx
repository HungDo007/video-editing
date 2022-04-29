import { styled } from '@mui/system';
import { grey } from './colors'
const Pre = styled('pre')(
  ({ theme }) => `
  font-size: 0.75rem;
  margin: 0px;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(0, 30, 60, 0.5)' : grey[50]
    };
  color: ${theme.palette.mode === 'dark' ? grey[400] : grey[700]};
  `,
);
export default Pre;