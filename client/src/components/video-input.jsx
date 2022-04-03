import { useRef, useState, useEffect } from "react";

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

import ReactPlayer from "react-player";

import videoEditingApi from "../api/video-editing";
import CustomBar from "./custom/custom-bar";

const VideoInput = () => {
  const videoPlayer = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoPieceTime, setVideoPieceTime] = useState([0, 0]);

  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState("");

  // const handleChange = (event) => {
  //   const files = event.target.files;
  //   let duration = 0;
  //   let arr = [];
  //   for (let index = 0; index < files.length; index++) {
  //     const file = files[index];
  //     const url = URL.createObjectURL(file);
  //     const reader = new FileReader();
  //     const videoObj = {
  //       name: file.name,
  //       url: url,
  //     };
  //     reader.onload = () => {
  //       let media = new Audio(reader.result);
  //       media.onloadedmetadata = () => {
  //         duration += media.duration;
  //         videoObj["duration"] = media.duration;
  //         setTotalDuration(duration);
  //       };
  //     };
  //     reader.readAsDataURL(file);

  //     arr.push(videoObj);
  //   }
  //   setVideos(arr);
  // };

  const handleSelectChange = (event) => {
    setMatchId(event.target.value);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
    setVideoPieceTime(newValue);
    const newVideos = [...videos];
    newVideos[videoIndex].startTime = newValue[0];
    newVideos[videoIndex].endTime = newValue[1];
    setVideos(newVideos);
    videoPlayer.current.seekTo(newValue[0], "seconds");
  };

  const handleCheckBoxChange = (event) => {
    const newVideos = [...videos];
    newVideos[videoIndex].remove = event.target.checked;
    setVideos(newVideos);
  };

  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await videoEditingApi.getMatches();
        setMatches(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
  }, []);

  useEffect(() => {
    const getMatchById = async () => {
      try {
        const params = {
          Id: matchId,
        };
        const response = await videoEditingApi.getMatchById(params);
        if (response.data) {
          const videos = response.data.videos.map((video) => ({
            ...video,
            remove: false,
            startTime: videoPieceTime[0].toString(),
            endTime: videoPieceTime[1].toString(),
          }));
          const totalDuration = response.data.videos.reduce(
            (accumulator, video) => {
              return accumulator + video.duration;
            },
            0
          );
          setTotalDuration(totalDuration);
          setVideos(videos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMatchById();
  }, [matchId]);
  // console.log(matches);
  const handleEditVideo = () => {
    const payload = videos.reduce((filtered, video) => {
      if (!video.remove) {
        const newVideoInfo = {
          publicId: video.publicId,
          startTime: video.startTime,
          endTime: video.endTime,
        };
        filtered.push(newVideoInfo);
      }
      return filtered;
    }, []);
    console.log(payload);
    const concatHighlight = async () => {
      try {
        const response = await videoEditingApi.concatHighlight(
          matchId,
          payload
        );
        console.log(response);
      } catch (error) {
        console.log(error.response);
      }
    };
    concatHighlight();
  };
  return (
    <div className="tournament-block">
      <div className="tournament-info">
        <Card sx={{ padding: 5 }}>
          <div className="tournament-field">
            <p>Choose match</p>
            <Select
              displayEmpty
              sx={{ width: 300 }}
              value={matchId}
              onChange={handleSelectChange}
            >
              {matches.map((match) => (
                <MenuItem key={match.id} value={match.id}>
                  {match.tournametName} - {match.matchName}
                </MenuItem>
              ))}
            </Select>
          </div>
          {/* <input
            multiple
            id="raised-button-file"
            type="file"
            onChange={handleChange}
          /> */}
          <ReactPlayer
            ref={videoPlayer}
            url={videos[videoIndex]?.url}
            onDuration={handleDuration}
            controls
            width="100%"
            height="500px"
          />
          <Box sx={{ display: "flex" }}>
            <Slider
              min={0}
              max={duration}
              value={videoPieceTime}
              valueLabelDisplay="auto"
              valueLabelFormat={(s) =>
                new Date(s * 1000).toISOString().substr(11, 8)
              }
              onChange={handleSlideChange}
            />
            <Tooltip title="Remove">
              <Checkbox
                checked={videos[videoIndex]?.remove ?? false}
                onChange={handleCheckBoxChange}
              />
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>0:00</div>
            <div>{new Date(duration * 1000).toISOString().substr(11, 8)}</div>
          </Box>
          <CustomBar
            videos={videos}
            duration={totalDuration}
            setIndex={setVideoIndex}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <div>0:00</div>
            <div>
              {new Date(totalDuration * 1000).toISOString().substr(11, 8)}
            </div>
          </Box>
          <div></div>
          <Box sx={{ textAlign: "center" }}>
            <Button variant="contained" onClick={handleEditVideo}>
              Finish
            </Button>
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default VideoInput;
