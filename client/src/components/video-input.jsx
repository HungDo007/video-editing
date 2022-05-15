import { useRef, useState, useEffect } from "react";

import {
  Box,
  Button,
  Checkbox,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import ReactPlayer from "react-player";
import videoEditingApi from "../api/video-editing";
import CustomBar from "./custom/custom-bar";
import { useLocation } from "react-router-dom";
import HighlightReview from "./highlight-review";
import TableEditVideo from "./TableEditVideo";

export const formatTimeSlice = (time) => {
  var mind = time % (60 * 60);
  var minutes = Math.floor(time / 60);

  var secd = mind % 60;
  var seconds = Math.ceil(secd);
  return minutes + ":" + ("0" + seconds).slice(-2);
};

const VideoInput = () => {
  const [opendialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const videoPlayer = useRef(null);
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);
  const [isTrimmed, setIsTrimmed] = useState(true);
  const [rowSelected, setRowSelected] = useState();

  const [hlDescription, setHlDescription] = useState("");
  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();
  const [videoSrc, setVideoSrc] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dis, setDis] = useState(true);
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
  const [highlights, setHighlights] = useState();

  const getHighlight = async () => {
    try {
      var response = await videoEditingApi.getHighlightOfMatch(
        location.state.row.id
      );
      setHighlights(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    console.log(rowSelected);
    setVideoPieceTime([rowSelected?.startTime, rowSelected?.endTime]);
  }, [duration]);

  useEffect(() => {
    const a = filtered.filter((fil) => {
      if (fil.selected) {
        return true;
      }
      return false;
    }).length;
    if (a > 0) {
      setDis(false);
    } else {
      setDis(true);
    }
  }, [filtered]);

  useEffect(() => {
    const getData = async () => {
      const response = await videoEditingApi.getMatchById({
        Id: location.state.row.id,
      });

      setBody(response.data.jsonFile);
      const videos = response.data.jsonFile.event.map((video, i) => ({
        ...video,
        selected: i === 0 ? 1 : -1,
        startTime: 0,
        endTime: video.ts[1] - video.ts[0],
      }));
      setVideoSrc(videos);
      setRowSelected(videos[0]);
    };

    getData();
    getHighlight();
  }, []);

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
    console.log(newValue);
    setVideoPieceTime(newValue);
    const newVideoSrc = [...videoSrc];
    const a = { ...rowSelected };
    a.startTime = newValue[0];
    a.endTime = newValue[1];
    const vdSrc = newVideoSrc.findIndex((vid) => vid.file_name === a.file_name);
    setRowSelected(a);
    newVideoSrc[vdSrc] = a;
    console.log(newVideoSrc);
    setVideoSrc(newVideoSrc);

    videoPlayer.current.seekTo(newValue[0], "seconds");
  };
  //console.log(videoSrc);
  const handleEditVideo = () => {
    const payload = videoSrc.reduce((filtered, video) => {
      if (video.selected === 1) {
        filtered.push(video);
      }
      return filtered;
    }, []);
    console.log(payload);
    setFiltered(payload);
    setOpenDialog(true);
  };

  const handleSendServer = () => {
    const payload = filtered.reduce((filter, video) => {
      if (video.selected) {
        const newVideoInfo = {
          level: video.level,
          time: video.time,
          event: video.event,
          file_name: video.file_name,
          players: video.players,
          ts: [video.ts[0] + video.startTime, video.ts[0] + video.endTime],
        };
        filter.push(newVideoInfo);
      }
      return filter;
    }, []);
    const newBody = {
      ...body,
      event: payload,
    };

    const concatHighlight = async () => {
      try {
        const response = await videoEditingApi.concatHighlight(
          location.state.row.id,
          hlDescription,
          newBody
        );
        setOpen(false);
        setNoti(true);
        setMessage("Concat Succeed");
        setTypeNoti("success");
        getHighlight();
      } catch (error) {
        console.log(error.response.data.description);
        setOpen(false);
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    setOpenDialog(false);
    setOpen(true);
    concatHighlight();
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handdelchange = (e, video) => {
    const newVideos = [...videos];
    const newVideoSrc = [...videoSrc];
    const vd = newVideos.findIndex((vid) => vid.file_name === video.file_name);
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === video.file_name
    );
    newVideos[vd].selected = e.target.checked;
    newVideoSrc[vdSrc].selected = e.target.checked;
    setVideos(newVideos);
    setVideoSrc(newVideoSrc);
  };

  const handleReviewChange = (e, video) => {
    const newVideos = [...filtered];
    const a = newVideos.findIndex((vid) => vid.file_name === video.file_name);
    newVideos[a].selected = e.target.checked ? 1 : 0;
    setFiltered(newVideos);
  };

  const onTableClick = (row) => {
    console.log(row);
    setRowSelected(row);
    const newVideoSrc = [...videoSrc];
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === row.file_name
    );
    if (row.selected !== 0) {
      setIsTrimmed(true);
      newVideoSrc[vdSrc].selected = 1;
    } else {
      setIsTrimmed(false);
    }
    setVideoSrc(newVideoSrc);
  };

  const handleNotQualifiedOrTrimmedClick = () => {
    const newVideoSrc = [...videoSrc];
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === rowSelected.file_name
    );
    newVideoSrc[vdSrc].selected = isTrimmed ? 0 : 1;
    setIsTrimmed(!isTrimmed);
    setVideoSrc(newVideoSrc);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={opendialog}
        onClose={handleClose}
        scroll={scroll}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#333333",
            color: "#ffffff",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          id="scroll-dialog-title"
        >
          <b>Concat Video Selected</b>
          <TextField
            sx={{
              width: "50%",
              "& fieldset ": {
                borderColor: "white",
              },
            }}
            InputProps={{
              sx: { color: "white" },
            }}
            value={hlDescription}
            onChange={(e) => setHlDescription(e.target.value)}
            multiline
            small
            placeholder="Enter description for video highlight"
          />
          <Button variant="contained" onClick={handleSendServer} disabled={dis}>
            Finish
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            minHeight="60vh"
          >
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
                {filtered?.map((video, i) => (
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
                      {formatTimeSlice(video.ts[0] + video.startTime)}
                    </TableCell>
                    <TableCell
                      key={6}
                      sx={{
                        border: "1px solid #76BBD9",
                        padding: 1,
                      }}
                      align="center"
                    >
                      {formatTimeSlice(video.ts[0] + video.endTime)}
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
                        onChange={(e) => handleReviewChange(e, video)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(filtered === undefined || filtered.length === 0) && (
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
          </DialogContentText>
        </DialogContent>
      </Dialog>

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

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid item xs={12}>
            <ReactPlayer
              ref={videoPlayer}
              url={rowSelected?.file_name}
              onDuration={handleDuration}
              controls
              playing={true}
              width="100%"
              height="auto"
            />
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
            <Grid item xs={10}>
              <Box sx={{ display: "flex" }}>
                <Slider
                  min={0}
                  max={duration}
                  value={videoPieceTime}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(s) => {
                    const a = s + rowSelected?.ts[0];

                    return formatTimeSlice(a);
                    // new Date(a * 1000).toISOString().substr(11, 8);
                  }}
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
                <div>{formatTimeSlice(rowSelected?.ts[0])}</div>
                <div>{formatTimeSlice(rowSelected?.ts[1])}</div>
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              justifyContent="center"
              padding="5px"
            >
              <Button
                variant="contained"
                color={isTrimmed ? "error" : "info"}
                onClick={handleNotQualifiedOrTrimmedClick}
              >
                {isTrimmed ? "Not qualified" : "Trimmed"}
              </Button>
            </Grid>
          </Grid>
          {/* <CustomBar
            videos={videos?.slice(page * rPP, page * rPP + rPP)}
            idx={videoIndex}
            setIndex={setVideoIndex}
          /> */}
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid item xs={4}>
          <TableEditVideo data={videoSrc} onTableClick={onTableClick} />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "center", margin: 2 }}>
        <Button variant="contained" onClick={handleEditVideo}>
          Review
        </Button>
      </Box>
      <div
        style={{ height: 3, backgroundColor: "black", marginBottom: "15px" }}
      ></div>
      <HighlightReview getHighlight={getHighlight} highlights={highlights} />
    </>
  );
};

export default VideoInput;
