import React from "react";
import { TextField, Autocomplete } from "@mui/material";

export default function CustomSelect(props) {
  const { value, options, onChange, labelRender, placeholder, require } = props;
  return (
    <div>
      <Autocomplete
        options={options ? options : []}
        size="small"
        value={value || null}
        fullWidth
        getOptionLabel={(option) => option[labelRender] || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            required={require ? require : false}
            inputProps={{ ...params.inputProps }}
          />
        )}
        onChange={onChange}
      />
    </div>
  );
}
