import { useRef, useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

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
  InputAdornment,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TableContainer,
} from "@mui/material";

import ReactPlayer from "react-player";
import { TablePagination } from "./flugin";
import videoEditingApi from "../api/video-editing";
import CustomBar from "./custom/custom-bar";
import { useLocation } from "react-router-dom";
import HighlightReview from "./highlight-review";

const VideoInput = () => {
  const [opendialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const videoPlayer = useRef(null);
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  console.log(videos);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value !== "") {
        const payload = videoSrc.reduce((filter, video) => {
          if (video.event.includes(value)) {
            const newVideoInfo = {
              level: video.level,
              time: video.time,
              event: video.event,
              file_name: video.file_name,
              players: video.players,
              selected: false,
              endTime: 0,
              startTime: 0,
              ts: [video.ts[0], video.ts[1]],
            };
            //console.log(newVideoInfo);
            filter.push(newVideoInfo);
          }
          return filter;
        }, []);
        setVideos(payload);
      } else {
        const payload = videoSrc.reduce((filter, video) => {
          //console.log(video);
          filter.push(video);
          return filter;
        }, []);
        setVideos(payload);
        //setVideos(payload);
      }
    }, 500);
  };

  const formatTimeSlice = (time) => {
    if (time) {
      return ("0" + time).slice(-4, -2) + ":" + ("0" + time).slice(-2);
    } else {
      return "";
    }
  };

  useEffect(() => {
    setRPP(rowsPerPage === -1 ? videos?.length + 1 : rowsPerPage);
  }, [videos, rowsPerPage]);

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
      const videos = response.data.jsonFile.event.map((video) => ({
        ...video,
        selected: false,
        startTime: 0,
        endTime: 0,
      }));
      setVideoSrc(videos);
    };

    getData();
    getHighlight();
  }, []);

  useEffect(() => {
    const payload = videoSrc.reduce((filtered, video) => {
      filtered.push(video);
      return filtered;
    }, []);
    setVideos(payload);
  }, [videoSrc?.length]);

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
    setVideoPieceTime(newValue);
    const newVideos = [...videos];
    const newVideoSrc = [...videoSrc];
    newVideos[page * rowsPerPage + videoIndex].startTime = newValue[0];
    newVideos[page * rowsPerPage + videoIndex].endTime = newValue[1];
    newVideos[page * rowsPerPage + videoIndex].selected = true;
    const vdSrc = newVideoSrc.findIndex(
      (vid) =>
        vid.file_name === newVideos[page * rowsPerPage + videoIndex].file_name
    );
    setVideos(newVideos);
    newVideoSrc[vdSrc].selected = true;
    setVideoSrc(newVideoSrc);
    videoPlayer.current.seekTo(newValue[0], "seconds");
  };

  const handleEditVideo = () => {
    const payload = videoSrc.reduce((filtered, video) => {
      if (video.selected) {
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
        console.log(response);
        setOpen(false);
        setNoti(true);
        setMessage("Concat Succeed");
        setTypeNoti("success");
        getHighlight();
      } catch (error) {
        setOpen(false);
        setNoti(true);
        setMessage(error.response.description);
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
    newVideos[a].selected = e.target.checked;
    setFiltered(newVideos);
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
              url={
                videos[page * rowsPerPage + videoIndex]
                  ? videos[page * rowsPerPage + videoIndex].file_name
                  : null
              }
              onDuration={handleDuration}
              controls
              playing={true}
              width="100%"
              height="auto"
            />
          </Grid>
          <Grid item xs={12} display="flex" spacing={2} alignItems="center">
            <Grid item xs={10}>
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
                {/* <div>0:00</div>
        <div>{new Date(duration * 1000).toISOString().substr(11, 8)}</div> */}
                <div>
                  {formatTimeSlice(
                    videos[page * rowsPerPage + videoIndex]?.ts[0]
                  )}
                </div>
                <div>
                  {formatTimeSlice(
                    videos[page * rowsPerPage + videoIndex]?.ts[1]
                  )}
                </div>
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              justifyContent="center"
              padding="5px"
            >
              <Button variant="contained">Trim</Button>
            </Grid>
          </Grid>
          <CustomBar
            videos={videos?.slice(page * rPP, page * rPP + rPP)}
            idx={videoIndex}
            setIndex={setVideoIndex}
          />
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid item xs={4}>
          <TableContainer style={{ maxHeight: "90vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#CEEBF9" }}>
                  <TableCell
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    colSpan={3}
                  >
                    {/* <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                  </div> */}

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
                  </TableCell>
                  {/* <TableCell
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  colSpan={4}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                  <TablePagination
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    count={videos ? videos.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                  />
                </TableCell> */}
                </TableRow>
                <TableRow sx={{ backgroundColor: "#CEEBF9" }}>
                  {/* <TableCell
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  colSpan={4}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                </TableCell> */}
                  <TableCell
                    sx={{
                      border: "1px solid #76BBD9",
                      padding: 1,
                    }}
                    colSpan={3}
                  >
                    {/* <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                  </div> */}
                    <TablePagination
                      rowsPerPage={rowsPerPage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      count={videos ? videos.length : 0}
                      page={page}
                      onPageChange={handleChangePage}
                    />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "#CEEBF9", height: "58px" }}>
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
                  {/* <TableCell
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
                </TableCell> */}
                  {/* <TableCell
                  key={5}
                  sx={{
                    border: "1px solid #76BBD9",
                    padding: 1,
                  }}
                  align="center"
                >
                  <b>Select</b>
                </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* style={ {minHeight: '45px' } } */}
                {videos?.slice(page * rPP, page * rPP + rPP).map((video, i) => (
                  <TableRow
                    key={i}
                    onClick={() => setVideoIndex(i)}
                    style={{
                      backgroundColor: i === videoIndex ? "#FD8E5E" : "white",
                    }}
                  >
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
                    {/* <TableCell
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
                  </TableCell> */}
                    {/* <TableCell
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
                  </TableCell> */}
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
          </TableContainer>
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
