import {
  Box,
  Button,
  Card,
  Checkbox,
  MenuItem,
  Select,
  Slider,
  Tooltip,
} from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import CustomBar from "./custom/custom-bar";

const VideoInput = () => {
  const videoPlayer = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [duration, setDuration] = useState(0);
  const [index, setIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [value, setValue] = useState([0, 0]);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    const files = event.target.files;
    let duration = 0;
    let arr = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      const videoObj = {
        name: file.name,
        url: url,
      };
      reader.onload = () => {
        let media = new Audio(reader.result);
        media.onloadedmetadata = () => {
          duration += media.duration;
          videoObj["duration"] = media.duration;
          setTotalDuration(duration);
        };
      };
      reader.readAsDataURL(file);

      arr.push(videoObj);
    }
    setVideos(arr);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
    setValue(newValue);

    videoPlayer.current.seekTo(newValue[0], "seconds");
  };

  const handleCheckBoxChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSave = () => {
    console.log(value);
    console.log(videos);
  };

  return (
    <div className="tournament-block">
      <div className="tournament-info">
        <Card sx={{ padding: 5 }}>
          <div className="tournament-field">
            <p>Choose match</p>
            <Select displayEmpty>
              <MenuItem>C1 - Base Real 0.00 1/1/2023</MenuItem>
            </Select>
          </div>
          <input
            multiple
            id="raised-button-file"
            type="file"
            onChange={handleChange}
          />
          <ReactPlayer
            ref={videoPlayer}
            url={videos[index]?.url}
            onDuration={handleDuration}
            controls
            width="100%"
            height="100%"
          />
          <Box sx={{ display: "flex" }}>
            <Slider
              min={0}
              max={duration}
              value={value}
              valueLabelDisplay="auto"
              valueLabelFormat={(s) =>
                new Date(s * 1000).toISOString().substr(11, 8)
              }
              onChange={handleSlideChange}
            />
            <Tooltip title="Remove">
              <Checkbox checked={checked} onChange={handleCheckBoxChange} />
            </Tooltip>
          </Box>
          <CustomBar
            videos={videos}
            duration={totalDuration}
            setIndex={setIndex}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>0:00</div>
            <div>
              {new Date(totalDuration * 1000).toISOString().substr(11, 8)}
            </div>
          </Box>
          <div>
            <Button variant="outlined" onClick={() => handleSave()}>
              Save
            </Button>
          </div>
          <Box sx={{ textAlign: "center" }}>
            <Button variant="contained">Finish</Button>
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default VideoInput;
