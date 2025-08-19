

import type { TextFieldProps } from '@mui/material/TextField'
import TextField from '@mui/material/TextField';
const AppInput: React.FC<TextFieldProps> = (props) => {
  return <TextField variant="outlined" fullWidth margin="normal" {...props} />;
};

export default AppInput; 