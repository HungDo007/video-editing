import { useState } from "react";

import { Button, IconButton, Slider, Tooltip } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import "./actions-labeling.styles.scss";

const ActionsLabeling = () => {
  const [videoSrc, setVideoSrc] = useState();

  const handleChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  return (
    <div>
      <div>
        <h2>ACTIONS LABELING</h2>
      </div>
      <div className="file-upload">
        <input
          accept="video/*"
          hidden
          id="raised-button-file"
          type="file"
          onChange={handleChange}
        />
        <label className="file-upload-btn" htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Upload videos
          </Button>
        </label>
        <p>ten_folder</p>
      </div>
      <div className="video-container">
        <div className="video-content">
          <div>
            <video src={videoSrc} width={700} controls />
          </div>
          <div className="cut-btn">
            <Button variant="outlined">Add to Start</Button>
            <Button variant="outlined">Add to End</Button>
          </div>
          <div>
            <Slider />
          </div>
          <div className="control-btn">
            <div>
              <Tooltip title="STOP">
                <IconButton size="large">
                  <StopIcon color="error" fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="BACK">
                <IconButton size="large">
                  <ArrowBackIosIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="PLAY">
                <IconButton size="large">
                  <PlayArrowIcon color="success" fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="NEXT">
                <IconButton size="large">
                  <ArrowForwardIosIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="cut-table">
          <table>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>a</td>
                <td>b</td>
                <td>c</td>
                <td>d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="create-models-btn">
        <Button endIcon={<ArrowForwardIosIcon />} variant="contained">
          Create Models
        </Button>
      </div>
    </div>
  );
};

export default ActionsLabeling;
