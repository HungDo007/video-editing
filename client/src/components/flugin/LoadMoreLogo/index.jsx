import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const AutoCompleteForAddLogo = (props) => {
  const { options, onChange, value, position } = props;
  return (
    <Autocomplete
      sx={{ width: "200px" }}
      options={options ? options : []}
      size="small"
      value={value || null}
      getOptionLabel={(option) => option["event"] || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Logo ${
            position === 1
              ? "Top-Right"
              : position === 2
              ? "Bottom-Right"
              : position === 3
              ? "Bottom-Left"
              : "Top-Left"
          }`}
          placeholder="Select logo"
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={(e, value) => onChange(value, position)}
    />
  );
};

function DialogMoreLogo(props) {
  const { open, handleClose, onChange, eventLogo, logoAdd } = props;

  const descriptionElementRef = useRef(null);
  const handleChange = (value, position) => {
    onChange(value, position);
  };
  return (
    <Dialog open={open} scroll="paper">
      <DialogTitle
        sx={{
          backgroundColor: "#CEEBF9",
          fontSize: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        id="scroll-dialog-title"
      >
        <h4>Add Logo</h4>
        <IconButton color="primary" onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Grid container spacing={2} width="450px">
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Top-Right"
                  disabled
                  checked={logoAdd[0].checked}
                />
                <AutoCompleteForAddLogo
                  options={eventLogo}
                  value={{
                    event: logoAdd[0].event,
                    file_name: logoAdd[0].file_name,
                  }}
                  onChange={handleChange}
                  position={1}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Bottom-Right"
                  disabled
                  checked={logoAdd[1].checked}
                />
                <AutoCompleteForAddLogo
                  options={eventLogo}
                  value={{
                    event: logoAdd[1].event,
                    file_name: logoAdd[1].file_name,
                  }}
                  onChange={handleChange}
                  position={2}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  disabled
                  label="Bottom-Left"
                  checked={logoAdd[2].checked}
                />
                <AutoCompleteForAddLogo
                  options={eventLogo}
                  value={{
                    event: logoAdd[2].event,
                    file_name: logoAdd[2].file_name,
                  }}
                  onChange={handleChange}
                  position={3}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  disabled
                  label="Top-Left"
                  checked={logoAdd[3].checked}
                />
                <AutoCompleteForAddLogo
                  options={eventLogo}
                  value={{
                    event: logoAdd[3].event,
                    file_name: logoAdd[3].file_name,
                  }}
                  onChange={handleChange}
                  position={4}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default DialogMoreLogo;
