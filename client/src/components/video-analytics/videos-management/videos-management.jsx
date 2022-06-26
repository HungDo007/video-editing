import { Box, Button, Grid, TextField } from "@mui/material";
import { configure } from "@testing-library/react";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { CheckboxesTags, CustomDatePicker, CustomSelect } from "../../flugin";

import "./style.scss";

const fileTypes = ["MP3", "MP4"];
const options = [
  { name: "a", id: 1 },
  { name: "b", id: 2 },
  { name: "c", id: 3 },
];

function VideoManagement() {
  const [file, setFile] = useState(null);
  const [context, setContext] = useState([]);
  const [config, setConfig] = useState([]);
  const [date, setDate] = useState(new Date());
  const [model, setModel] = useState();

  const handleContextChange = (e, value) => {
    setContext(value);
  };

  const handleConfigChange = (e, value) => {
    setConfig(value);
  };

  const handleModelChange = (e, value) => {
    setModel(value);
  };

  const handleDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleChange = (file) => {
    setFile(file);
  };
  return (
    <div>
      <h3>VIDEO MANAGEMENT</h3>

      <Box sx={{ border: "2px solid grey" }} padding="5rem 5rem 1rem 5rem">
        <Grid container spacing={2} mb={2}>
          <Grid item xs={3}>
            <div style={{ textAlign: "center" }}>
              Drag or Drop your file here
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
              />
            </div>
          </Grid>
          <Grid item xs={0.5} />
          <Grid item xs={5}>
            <TextField
              sx={{
                marginBottom: "10px",
              }}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter input URLs/File"
            />
            <TextField
              sx={{
                marginBottom: "10px",
              }}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Enter input Video Name"
            />
            <div
              style={{
                display: "flex",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <Grid item xs={3}>
                <input
                  type="radio"
                  id="vehicle1"
                  name="vehicle1"
                  value="Bike"
                />
                <label htmlFor="vehicle1"> Schedule</label>
              </Grid>

              <Grid item xs={9}>
                <CustomDatePicker value={date} onChange={handleDateChange} />
              </Grid>
            </div>
          </Grid>
          <Grid item xs={3.5} />
          <Grid item xs={4}>
            Model
            <CustomSelect
              options={options}
              labelRender="name"
              value={model}
              onChange={handleModelChange}
            />
          </Grid>
          <Grid item xs={4}>
            Context
            <CheckboxesTags
              options={options}
              labelRender="name"
              value={context}
              onChange={handleContextChange}
            />
          </Grid>
          <Grid item xs={4}>
            Config
            <CheckboxesTags
              options={options}
              labelRender="name"
              value={config}
              onChange={handleConfigChange}
            />
          </Grid>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginTop: 3,
          }}
        >
          <Button variant="contained">Add Video</Button>
        </div>
      </Box>
    </div>
  );
}

export default VideoManagement;
