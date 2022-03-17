import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags(props) {
  const { options, labelRender, value, onChange } = props;

  return (
    <Autocomplete
      multiple
      size="small"
      options={options ? options : []}
      value={value}
      onChange={onChange}
      disableCloseOnSelect
      getOptionLabel={(option) => option[labelRender]}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option[labelRender]}
        </li>
      )}
      fullWidth
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
