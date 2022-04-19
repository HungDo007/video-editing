import { useRef, useState, useEffect } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import ReactPlayer from "react-player";

import videoEditingApi from "../api/video-editing";
import CustomBar from "./custom/custom-bar";
import { useLocation } from "react-router-dom";

const VideoInput = () => {
  const location = useLocation();
  const videoPlayer = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videoPieceTime, setVideoPieceTime] = useState([0, 0]);

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [videoResult, setVideoResult] = useState("");

  useEffect(() => {
    const getMatchById = async () => {
      try {
        const params = {
          Id: location.state.row.id,
        };
        const response = await videoEditingApi.getMatchById(params);
        if (response.data) {
          const videos = response.data.videos.map((video) => ({
            ...video,
            remove: false,
            startTime: videoPieceTime[0],
            endTime: videoPieceTime[1],
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
  }, []);

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
    setOpen(true);
    const concatHighlight = async () => {
      try {
        const response = await videoEditingApi.concatHighlight(
          location.state.row.id,
          payload
        );
        console.log(response);
        setOpen(false);
        setVideoResult(response.data);
        setOpenDialog(true);
      } catch (error) {
        setOpen(false);
        alert(error.response.description);
      }
    };
    concatHighlight();
  };

  const handdelchange = (e, video) => {
    console.log(e.target.checked, video);
    const newVideos = [...videos];
    const a = newVideos.findIndex((vid) => vid.publicId === video.publicId);
    newVideos[a].remove = e.target.checked;
    setVideos(newVideos);
  };

  return (
    <div className="tournament-block">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="1192px"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#333333",
            color: "#ffffff",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div> View Result</div>
          <Button onClick={() => setOpenDialog(false)}>
            <CancelOutlinedIcon className="color-button-cancel" />
          </Button>
        </DialogTitle>

        {/**Dialog xem hóa đơn */}
        <DialogContent
          sx={{
            width: "60vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          dividers={scroll === "paper"}
        >
          <ReactPlayer
            ref={null}
            //url={process.env.REACT_APP_IMAGE_URL + videoResult}
            url={videoResult}
            controls
            width="100%"
            height="100%"
          />
        </DialogContent>
      </Dialog>

      <div className="tournament-info">
        <Card sx={{ padding: 5 }}>
          <ReactPlayer
            ref={videoPlayer}
            // url={
            //   videos[videoIndex]
            //     ? process.env.REACT_APP_IMAGE_URL + videos[videoIndex].url
            //     : null
            // }
            url={videos[videoIndex] ? videos[videoIndex].url : null}
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
          </Box>
          <Box
            sx={{
              marginBottom: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>0:00</div>
            <div>{new Date(duration * 1000).toISOString().substr(11, 8)}</div>
          </Box>
          <CustomBar
            videos={videos}
            duration={totalDuration}
            setIndex={setVideoIndex}
          />
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>0:00</div>
            <div>
              {new Date(totalDuration * 1000).toISOString().substr(11, 8)}
            </div>
          </Box>
          <div></div>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#CEEBF9" }}>
                <TableCell
                  key={0}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>STT</b>
                </TableCell>
                <TableCell
                  key={1}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>Name</b>
                </TableCell>
                <TableCell
                  key={2}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>Start</b>
                </TableCell>
                <TableCell
                  key={3}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>End</b>
                </TableCell>
                <TableCell
                  key={4}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>Remove</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* style={ {minHeight: '45px' } } */}
              {videos.map((video, i) => (
                <TableRow key={i}>
                  <TableCell
                    key={1}
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    align="center"
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    key={2}
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    align="center"
                  >
                    {video.name}
                  </TableCell>
                  <TableCell
                    key={3}
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    align="center"
                  >
                    {video.startTime}
                  </TableCell>
                  <TableCell
                    key={6}
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    align="center"
                  >
                    {video.endTime}
                  </TableCell>
                  <TableCell
                    key={7}
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    align="center"
                  >
                    <Checkbox
                      value={video.remove}
                      onChange={(e) => handdelchange(e, video)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ textAlign: "center", marginTop: 5 }}>
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
