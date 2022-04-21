import { useRef, useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import data from "../metadata_server.json";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import ReactPlayer from "react-player";
import { TablePagination } from "./flugin";
import videoEditingApi from "../api/video-editing";
import CustomBar from "./custom/custom-bar";
import { useLocation } from "react-router-dom";

const VideoInput = () => {
  const location = useLocation();
  const videoPlayer = useRef(null);
  const [matchName, setMatchName] = useState();

  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [duration, setDuration] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [body, setBody] = useState();
  const [videos, setVideos] = useState([]);
  const [videoPieceTime, setVideoPieceTime] = useState([0, 0]);
  const typingTimeoutRef = useRef(null);
  const [rPP, setRPP] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value !== "") {
        console.log(value);
      }
    }, 500);
  };

  useEffect(() => {
    setRPP(rowsPerPage === -1 ? videos?.length + 1 : rowsPerPage);
  }, [videos, rowsPerPage]);

  useEffect(() => {
    const getData = () => {
      setBody(data);
      const videos = data.event.map((video) => ({
        ...video,
        selected: false,
        startTime: videoPieceTime[0],
        endTime: videoPieceTime[1],
      }));
      setVideos(videos);
      setMatchName(data.match_name);
    };

    getData();
  }, []);

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
    setVideoPieceTime(newValue);
    const newVideos = [...videos];

    newVideos[page * rowsPerPage + videoIndex].startTime = newValue[0];
    newVideos[page * rowsPerPage + videoIndex].endTime = newValue[1];
    newVideos[page * rowsPerPage + videoIndex].selected = true;
    setVideos(newVideos);

    videoPlayer.current.seekTo(newValue[0], "seconds");
  };

  const handleEditVideo = () => {
    const payload = videos.reduce((filtered, video) => {
      if (video.selected) {
        const newVideoInfo = {
          level: video.level,
          time: video.time,
          event: video.event,
          file_name: video.file_name,
          players: video.players,
          ts: [video.ts[0] + video.startTime, video.ts[0] + video.endTime],
        };
        filtered.push(newVideoInfo);
      }
      return filtered;
    }, []);
    const newBody = {
      ...body,
      event: payload,
    };
    console.log(newBody);
    const concatHighlight = async () => {
      try {
        const response = await videoEditingApi.concatHighlight(
          location.state.row.id,
          newBody
        );
        console.log(response);
        setOpen(false);
        setNoti(true);
        setMessage("Concat Succeed, View result in function Highlight");
        setTypeNoti("success");
        // setVideoResult(response.data);
        // setOpenDialog(true);
      } catch (error) {
        setOpen(false);
        setNoti(true);
        setMessage(error.response.description);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    concatHighlight();
  };

  const handdelchange = (e, video) => {
    const newVideos = [...videos];
    const a = newVideos.findIndex((vid) => vid.publicId === video.publicId);
    newVideos[a].selected = e.target.checked;
    setVideos(newVideos);
  };
  return (
    <Box sx={{ padding: "1% 3%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={noti}
        autoHideDuration={5000}
        onClose={() => setNoti(false)}
      >
        <Alert
          onClose={() => setNoti(false)}
          severity={typeNoti}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <ReactPlayer
        ref={videoPlayer}
        url={videos[videoIndex] ? videos[videoIndex].file_name : null}
        onDuration={handleDuration}
        controls
        width="100%"
        height="auto"
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
        videos={videos?.slice(page * rPP, page * rPP + rPP)}
        setIndex={setVideoIndex}
      />
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#CEEBF9" }}>
            <TableCell
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              colSpan={6}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ minWidth: "40%" }}>
                  <TextField
                    id="input-with-icon-textfield"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    onChange={handleSearchChange}
                    variant="standard"
                    placeholder="Enter text to search"
                  />
                </div>
                <div>
                  <TablePagination
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    count={videos ? videos.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
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
              <b>Times</b>
            </TableCell>
            <TableCell
              key={3}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Start</b>
            </TableCell>
            <TableCell
              key={4}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>End</b>
            </TableCell>
            <TableCell
              key={5}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Select</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* style={ {minHeight: '45px' } } */}
          {videos?.slice(page * rPP, page * rPP + rPP).map((video, i) => (
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
                {video.event}
              </TableCell>
              <TableCell
                key={4}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {video.time.substring(0, 2)}m{video.time.substring(2, 4)}s
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
                  checked={video.selected}
                  onChange={(e) => handdelchange(e, video)}
                />
              </TableCell>
            </TableRow>
          ))}
          {(videos === undefined || videos.length === 0) && (
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #76BBD9",
                }}
                align="center"
                colSpan={6}
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Button variant="contained" onClick={handleEditVideo}>
          Finish
        </Button>
      </Box>
    </Box>
  );
};

export default VideoInput;
