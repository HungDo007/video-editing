import { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Slider,
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
  Autocomplete,
} from "@mui/material";
import { Tabs } from "antd";
import ReactPlayer from "react-player";
import videoEditingApi from "../../api/video-editing";
import { useLocation } from "react-router-dom";
import HighlightReview from "../highlight-review";
import TableEditVideo from "./TableEditVideo";
import { FileUploader } from "react-drag-drop-files";
import TableReview from "./TableReview";
import TableLogo from "./TableLogo";
import { CategoryTwoTone } from "@mui/icons-material";

const { TabPane } = Tabs;

export const formatTimeSlice = (time) => {
  var mind = time % (60 * 60);
  var minutes = Math.floor(time / 60);

  var secd = mind % 60;
  var seconds = Math.ceil(secd);
  return minutes + ":" + ("0" + seconds).slice(-2);
};

const options = [
  { label: "Top-Right", value: 1 },
  { label: "Bottom-Right", value: 2 },
  { label: "Bottom-Left", value: 3 },
  { label: "Top-Left", value: 4 },
];

const VideoInput = () => {
  const [opendialog, setOpenDialog] = useState(false);

  const [position, setPosition] = useState(undefined);
  const [eventName, setEventName] = useState(undefined);
  const [file, setFile] = useState();
  const [logo, setLogo] = useState();
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
  const previousDataRow = useRef(rowSelected);

  const [opendialogUploadEvent, setOpendialogUploadEvent] = useState(false);
  const [opendialogUploadLogo, setOpendialogUploadLogo] = useState(false);

  useEffect(() => {
    previousVideoPieceTime.current = videoPieceTime;
  }, [videoPieceTime]);
  console.log(body);
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

      setRowSelected(response.data.jsonFile.event[0]);
      const temp = response.data.jsonFile.event;

      if (response.data.jsonFile.event[0].selected === -1) {
        const tempdata = { ...response.data.jsonFile.event[0] };
        tempdata.selected = 1;
        updateLogTrimmed(tempdata);
        temp[0].selected = 1;
      }
      setLogo(response.data.jsonFile.logo);
      setVideoSrc(temp);
      setIsTrimmed(
        response.data.jsonFile.event[0].selected === 0 ? false : true
      );
    };

    getData();
    getHighlight();
  }, []);
  const updateLogTrimmed = async (eventUpdate) => {
    try {
      await videoEditingApi.updateLogTrimmed(
        location.state.row.id,
        eventUpdate
      );
    } catch (error) {}
  };

  const handleDuration = (duration) => {
    const temp = { ...previousDataRow.current };
    const sd = videoSrc.find((item) => item.file_name === temp.file_name);
    //send temp to update
    updateLogTrimmed(sd);
    previousDataRow.current = rowSelected;
    setDuration(duration);
  };

  const handleSlideChange = (event, newValue) => {
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
    videoPlayer.current.seekTo(newValue[indexSeekTo], "seconds");
  };

  const handleEditVideo = () => {
    const temp = { ...previousDataRow.current };
    updateLogTrimmed(temp);

    const tempFilter = [...videoSrc];
    const payload = tempFilter.reduce((filtered, video) => {
      if (video.selected === 1) {
        filtered.push(video);
      }
      return filtered;
    }, []);
    setFiltered(payload);
    setOpenDialog(true);
  };

  const handleSendServer = (e) => {
    e.preventDefault();
    const newBody = {
      ...body,
      event: filtered,
    };

    const concatHighlight = async () => {
      try {
        await videoEditingApi.concatHighlight(
          location.state.row.id,
          hlDescription,
          newBody
        );
        setOpen(false);
        setNoti(true);
        setOpenDialog(false);
        setMessage("Concat Succeed");
        setTypeNoti("success");
        getHighlight();
      } catch (error) {
        setNoti(true);
        setOpen(false);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    concatHighlight();
  };

  const handleDownloadOneClick = () => {
    const payload = [rowSelected];
    const newBody = {
      ...body,
      event: payload,
    };

    const downloadOne = async () => {
      try {
        var response = await videoEditingApi.downloadOne(
          location.state.row.id,
          hlDescription,
          newBody
        );
        setOpen(false);
        // Create blob link to download
        const link = document.createElement("a");
        link.href = response.data.replace("raw", "download");
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    downloadOne();
  };

  function download_files(files) {
    function download_next(i) {
      if (i >= files.length) {
        return;
      }
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.setAttribute("href", files[i].replace("raw", "download"));
      link.click();

      // Delete the temporary link.
      document.body.removeChild(link);
      // Download the next file with a small timeout. The timeout is necessary
      // for IE, which will otherwise only download the first file.
      setTimeout(function () {
        download_next(i + 1);
      }, 1000);
    }
    // Initiate the first download.
    download_next(0);
  }

  const handleSendServerNotMerge = () => {
    //const payload = reducerObj(filtered);
    const newBody = {
      ...body,
      event: filtered,
    };
    const downloadNotMerge = async () => {
      try {
        var response = await videoEditingApi.downloadNotMerge(
          location.state.row.id,
          hlDescription,
          newBody
        );
        setOpen(false);
        ///Create blob link to download

        download_files(response.data);
      } catch (error) {
        setNoti(true);
        //setMessage(error.response.data.description);
        setMessage(error);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    downloadNotMerge();
  };

  const handleClose = () => {
    setOpenDialog(false);
    setOpendialogUploadEvent(false);
    setOpendialogUploadLogo(false);
  };

  const handleClose1 = () => {
    setOpendialogUploadEvent(false);
    setOpendialogUploadLogo(false);
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
    updateLogTrimmed(newVideoSrc[vdSrc]);
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

  const handleUploadEventClick = () => {
    if (file === undefined || eventName === undefined) {
      setNoti(true);
      setMessage("Please chose file or enter event name");
      setTypeNoti("error");
      return;
    }

    const formdata = new FormData();
    formdata.append("eventName", eventName);
    formdata.append("file", file);
    formdata.append("logo", null);
    try {
      const uploadSmallVideo = async () => {
        var response = await videoEditingApi.uploadSmallVideo(formdata);
        const temp = [...filtered];
        temp.unshift(response.data);
        setFiltered(temp);
        setOpen(false);
        setNoti(true);
        setMessage("Upload Succeed");
        setTypeNoti("success");
        setOpendialogUploadEvent(false);
      };
      setOpen(true);
      uploadSmallVideo();
    } catch (error) {
      setNoti(true);
      setMessage(error.response.data.description);
      setTypeNoti("error");
    }
  };
  const handleUploadLogoClick = () => {
    if (file === undefined || position === undefined) {
      setNoti(true);
      setMessage("Please chose file or select position");
      setTypeNoti("error");
      return;
    }

    const formdata = new FormData();
    formdata.append("eventName", null);
    formdata.append("file", file);
    formdata.append("position", position.value);
    try {
      const uploadLogo = async () => {
        var response = await videoEditingApi.uploadLogo(
          location.state.row.id,
          formdata
        );
        setLogo(response.data);
        setOpen(false);
        setNoti(true);
        setMessage("Upload Succeed");
        setTypeNoti("success");
        setOpendialogUploadLogo(false);
        const body1 = { ...body };
        body1.logo = response.data;
        setBody(body1);
      };
      setOpen(true);
      uploadLogo();
    } catch (error) {
      setNoti(true);
      setMessage(error.response.data.description);
      setTypeNoti("error");
    }
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleIconRemoveEventClick = (row) => {
    const temp = [...filtered];
    const afterRemove = temp.filter((item) => item.file_name !== row.file_name);

    setFiltered(afterRemove);
  };

  const handleIconRemoveLogoClick = (position) => {
    try {
      const deleteLogo = async () => {
        var response = await videoEditingApi.deleteLogo(
          location.state.row.id,
          position
        );
        setLogo(response.data);
        setOpen(false);
        setNoti(true);
        setMessage("Delete Succeed");
        setTypeNoti("success");
        setOpendialogUploadLogo(false);
        const body1 = { ...body };
        body1.logo = response.data;
        setBody(body1);
      };
      setOpen(true);
      deleteLogo();
    } catch (error) {
      setNoti(true);
      setMessage(error.response.data.description);
      setTypeNoti("error");
    }
  };

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 100000000,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={opendialogUploadEvent}
        onClose={handleClose1}
        scroll={scroll}
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
          <h4>Upload more event</h4>
          <Button variant="contained" onClick={handleUploadEventClick}>
            Upload
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container spacing={2} width="450px">
              <Grid item xs={12}>
                <TextField
                  value={eventName}
                  label="Event Name"
                  variant="standard"
                  //size="small"
                  onChange={(e) => setEventName(e.target.value)}
                  fullWidth
                  //required={!hidden}
                  //placeholder="Enter league name"
                />
              </Grid>
              <Grid item xs={12}>
                <FileUploader
                  handleChange={handleFileChange}
                  name="file"
                  //types={["MP4,PNG,JPG,"]}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={opendialogUploadLogo}
        onClose={handleClose1}
        scroll={scroll}
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
          <h4>Upload file Logo</h4>
          <Button variant="contained" onClick={handleUploadLogoClick}>
            Upload
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container spacing={2} width="450px">
              <Grid item xs={12}>
                <Autocomplete
                  options={options}
                  //size="small"
                  value={position}
                  fullWidth
                  getOptionLabel={(option) => option["label"] || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Position"
                      variant="standard"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                  onChange={(e, value) => {
                    setPosition(value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FileUploader
                  handleChange={handleFileChange}
                  name="file"
                  //types={["MP4,PNG,JPG,"]}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={opendialog}
        onClose={handleClose}
        scroll={scroll}
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            minHeight="70vh"
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Event" key="1">
                <TableReview
                  data={filtered}
                  setData={setFiltered}
                  handleIconRemoveClick={handleIconRemoveEventClick}
                />
              </TabPane>
              <TabPane tab="Logo" key="2">
                <TableLogo
                  data={logo}
                  handleIconRemoveClick={handleIconRemoveLogoClick}
                />
              </TabPane>
            </Tabs>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            container
            component="form"
            onSubmit={handleSendServer}
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
              required
            />
            <div>
              <Button
                sx={{
                  backgroundColor: "#66CC66",
                }}
                variant="contained"
                onClick={() => {
                  setOpendialogUploadLogo(true);
                  setPosition(undefined);
                  setFile(undefined);
                }}
              >
                Upload Logo
              </Button>
              <Button
                sx={{
                  marginLeft: "10px",
                  backgroundColor: "#66CC66",
                }}
                variant="contained"
                onClick={() => {
                  setOpendialogUploadEvent(true);
                  setEventName(undefined);
                  setFile(undefined);
                }}
              >
                Upload More Event
              </Button>
              <Button
                sx={{
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={handleSendServerNotMerge}
                disabled={dis}
                color="secondary"
              >
                Download
              </Button>
              <Button
                sx={{
                  marginLeft: "10px",
                }}
                variant="contained"
                //onClick={handleSendServer}
                type="submit"
                disabled={dis}
              >
                Merge
              </Button>
            </div>
          </Grid>
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
                  {isTrimmed ? "Not qualified" : "Trim"}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadOneClick}
                  color="secondary"
                >
                  Download
                </Button>
                <div>{formatTimeSlice(rowSelected?.endTime)}</div>
              </Box>
            </div>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid item xs={5} overflow="auto">
          <TableEditVideo
            data={videoSrc}
            onTableClick={onTableClick}
            buttonReview={
              <Button variant="contained" onClick={handleEditVideo}>
                Review
              </Button>
            }
          />
        </Grid>
      </Grid>

      {/* <Box sx={{ textAlign: "center", margin: 2 }}>
        <Button variant="contained" onClick={handleEditVideo}>
          Review
        </Button>
      </Box> */}
      <div
        style={{ height: 3, backgroundColor: "black", marginBottom: "15px" }}
      ></div>
      <HighlightReview getHighlight={getHighlight} highlights={highlights} />
    </>
  );
};

export default VideoInput;
