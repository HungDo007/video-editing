import { useRef, useState, useEffect, useCallback } from "react";

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
  DialogActions,
} from "@mui/material";

import ReactPlayer from "react-player";
import videoEditingApi from "../api/video-editing";
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

  const [body, setBody] = useState();
  const [videoPieceTime, setVideoPieceTime] = useState([0, 0]);
  const previousVideoPieceTime = useRef(videoPieceTime);
  console.log(rowSelected);
  useEffect(() => {
    previousVideoPieceTime.current = videoPieceTime;
  }, [videoPieceTime]);

  const [open, setOpen] = useState(false);

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
    setVideoPieceTime([rowSelected?.startTime, rowSelected?.endTime]);
    videoPlayer.current.seekTo(
      rowSelected?.mainpoint - rowSelected?.ts[0],
      "seconds"
    );
  }, [rowSelected]);

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
      console.log(response.data.jsonFile.event);
      const videos = response.data.jsonFile.event.map((video, i) => ({
        ...video,
        selected: i === 0 ? 1 : -1,
        startTime:
          video.mainpoint - video.ts[0] < video.ts[1] - video.ts[0]
            ? video.mainpoint - video.ts[0]
            : video.ts[1] - video.ts[0],
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
    console.log(previousVideoPieceTime);
    let indexSeekTo;
    if (newValue[0] !== previousVideoPieceTime.current[0]) indexSeekTo = 0;
    else indexSeekTo = 1;
    setVideoPieceTime(newValue);
    const newVideoSrc = [...videoSrc];
    const a = { ...rowSelected };
    a.startTime = newValue[0];
    a.endTime = newValue[1];
    const vdSrc = newVideoSrc.findIndex((vid) => vid.file_name === a.file_name);
    setRowSelected(a);
    newVideoSrc[vdSrc] = a;
    setVideoSrc(newVideoSrc);
    console.log(indexSeekTo);
    videoPlayer.current.seekTo(newValue[indexSeekTo], "seconds");
  };

  const handleEditVideo = () => {
    const payload = videoSrc.reduce((filtered, video) => {
      if (video.selected === 1) {
        filtered.push(video);
      }
      return filtered;
    }, []);
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

  const handleReviewChange = (e, video) => {
    const newVideos = [...filtered];
    const a = newVideos.findIndex((vid) => vid.file_name === video.file_name);
    newVideos[a].selected = e.target.checked ? 1 : 0;
    setFiltered(newVideos);
  };

  const onTableClick = (row) => {
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
  const [isReady, setIsReady] = useState(false);
  const onReady = useCallback(
    (rowSelected) => {
      if (!isReady) {
        const timeToStart = rowSelected?.mainpoint - rowSelected?.ts[0];
        videoPlayer.current.seekTo(timeToStart, "seconds");
        setIsReady(true);
      }
    },
    [isReady]
  );

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
            backgroundColor: "#CEEBF9",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          id="scroll-dialog-title"
        >
          <b>Concat Video Selected</b>
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
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            sx={{
              width: "50%",
            }}
            label="Enter description for video highlight"
            value={hlDescription}
            onChange={(e) => setHlDescription(e.target.value)}
            multiline
            small
          />
          <div>
            <Button
              variant="contained"
              //onClick={handleSendServer}
              disabled={dis}
              color="secondary"
            >
              Trim not Concat
            </Button>
            <Button
              sx={{
                marginLeft: "10px",
              }}
              variant="contained"
              onClick={handleSendServer}
              disabled={dis}
            >
              Trim and Concat
            </Button>
          </div>
        </DialogActions>
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
        <Grid item xs={7}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <ReactPlayer
              ref={videoPlayer}
              url={rowSelected?.file_name}
              onDuration={handleDuration}
              controls
              onReady={() => onReady(rowSelected)}
              playing={true}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "720px" }}>
              <Box sx={{ display: "flex" }}>
                <Slider
                  min={0}
                  max={duration}
                  value={videoPieceTime}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(s) => {
                    return formatTimeSlice(s);
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
                <div>{formatTimeSlice(rowSelected?.startTime)}</div>
                <Button
                  variant="contained"
                  color={isTrimmed ? "error" : "info"}
                  onClick={handleNotQualifiedOrTrimmedClick}
                >
                  {isTrimmed ? "Not qualified" : "Trimmed"}
                </Button>
                <div>{formatTimeSlice(rowSelected?.endTime)}</div>
              </Box>
            </div>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid item xs={5} overflow="auto">
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
