import React from "react";
import {
  DesktopDatePicker,
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/lab";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField } from "@mui/material";

// export function convert(str) {
//     var date = new Date(str),
//       mnth = ("0" + (date.getMonth() + 1)).slice(-2),
//       day = ("0" + date.getDate()).slice(-2);
//     return [date.getFullYear(), mnth, day].join("-");
// }

function CustomDatePicker(props) {
  const { value, onChange, variant } = props;

  // const preHandleChange=(e)=>{
  //     const a = convert(e)
  //     onChange(a)
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDateTimePicker
        //inputFormat="dd/MM/yyyy HH:MM"
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
            }}
            variant={variant}
            size="small"
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
