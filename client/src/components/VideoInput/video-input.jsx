import { useRef, useState, useEffect, useCallback } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
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
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ReactPlayer from "react-player";
import videoEditingApi from "../../api/video-editing";
import { useLocation } from "react-router-dom";
import HighlightReview from "../highlight-review";
import TableEditVideo from "./TableEditVideo";
import TableReview from "./TableReview";
import { DialogMoreEvent, DialogMoreLogo } from "../flugin";

export const formatTimeSlice = (time) => {
  var mind = time % (60 * 60);
  var minutes = Math.floor(time / 60);

  var secd = mind % 60;
  var seconds = Math.ceil(secd);
  return minutes + ":" + ("0" + seconds).slice(-2);
};

const VideoInput = () => {
  const [connection, setConnection] = useState();
  const [opendialog, setOpenDialog] = useState(false);

  const [hlSuccess, setHlSuccess] = useState();

  const location = useLocation();
  const videoPlayer = useRef(null);

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

  const [eventGallery, setEventGallery] = useState();
  const [logoGallery, setLogoGallery] = useState();
  const [opendialogUploadEvent, setOpendialogUploadEvent] = useState(false);
  const [opendialogUploadLogo, setOpendialogUploadLogo] = useState(false);
  const [logoAdd, setLogoAdd] = useState(() => {
    const temp = [
      { position: 1, event: "", file_name: "", checked: false },
      { position: 2, event: "", file_name: "", checked: false },
      { position: 3, event: "", file_name: "", checked: false },
      { position: 4, event: "", file_name: "", checked: false },
    ];
    return temp;
  });

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
  const join = async () => {
    try {
      const connection1 = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_BASE_NOTI_URL)
        .configureLogging(LogLevel.Information)
        .build();

      connection1.on("noti", (user, message) => {
        setHlSuccess(JSON.parse(message));
      });
      await connection1.start();
      await connection1.invoke("JoinRoom", {
        username: localStorage.getItem("username"),
        room: localStorage.getItem("username"),
      });
      setConnection(connection1);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (hlSuccess) {
      const temp = [...highlights];
      const idx = temp.findIndex((hl) => hl.id === hlSuccess.id);
      temp[idx] = hlSuccess;
      setHighlights(temp);
    }
  }, [hlSuccess]);

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

      setVideoSrc(temp);
      setIsTrimmed(
        response.data.jsonFile.event[0].selected === 0 ? false : true
      );
    };
    const getGallery = async () => {
      try {
        var eventG = [];
        var logoG = [];
        var responseL = await videoEditingApi.getGallery(0);
        var responseE = await videoEditingApi.getGallery(1);
        if (responseE.data.length > 0) {
          responseE.data.forEach((element) => {
            const data = {
              event: element.event,
              file_name: element.file_name,
              selected: -1,
            };
            eventG.push(data);
          });
        }
        if (responseL.data.length > 0) {
          responseL.data.forEach((element) => {
            const data = { event: element.event, file_name: element.file_name };
            logoG.push(data);
          });
        }
        setLogoGallery(logoG);
        setEventGallery(eventG);
      } catch {}
    };
    getGallery();
    join();
    getData();
    getHighlight();
    return async () => {
      try {
        await connection.stop();
      } catch (e) {
        console.log(e);
      }
    };
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
    const temp = [...logoAdd];

    var logo = [];
    temp.forEach((element) => {
      if (element.checked) {
        logo.push([element.file_name, element.position.toString()]);
      }
    });

    const newBody = {
      ...body,
      event: filtered,
      logo: logo,
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
        setMessage("Consolidation in progress");
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

  const onCheck = (row) => {
    if (row.selected === 1) {
      const temp = [...filtered];
      temp.unshift(row);
      setFiltered(temp);
    } else {
      const temp = [...filtered];
      var newF = temp.filter((t) => t.file_name !== row.file_name);
      setFiltered(newF);
    }
  };

  const handleIconRemoveEventClick = (row) => {
    const temp = [...filtered];
    const afterRemove = temp.filter((item) => item.file_name !== row.file_name);

    setFiltered(afterRemove);
  };

  const onChangeSelectLogo = (value, position) => {
    const temp = [...logoAdd];
    const idx = temp.findIndex((l) => l.position === position);
    temp[idx].event = value?.event;
    temp[idx].file_name = value?.file_name;
    temp[idx].checked = value ? true : false;
    setLogoAdd(temp);
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

      <DialogMoreEvent
        open={opendialogUploadEvent}
        handleClose={handleClose1}
        onCheck={onCheck}
        eventGallery={eventGallery}
      />

      <DialogMoreLogo
        open={opendialogUploadLogo}
        handleClose={handleClose1}
        onChange={onChangeSelectLogo}
        eventLogo={logoGallery}
        logoAdd={logoAdd}
      />

      <Dialog
        open={opendialog}
        onClose={handleClose}
        scroll="paper"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            minHeight="70vh"
          >
            <TableReview
              data={filtered}
              setData={setFiltered}
              handleIconRemoveClick={handleIconRemoveEventClick}
              logo={logoAdd}
            />
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
                  backgroundColor: "#996699",
                }}
                variant="contained"
                onClick={() => {
                  setOpendialogUploadLogo(true);
                }}
              >
                Add Logo
              </Button>
              <Button
                sx={{
                  marginLeft: "10px",
                  backgroundColor: "#996699",
                }}
                variant="contained"
                onClick={() => {
                  setOpendialogUploadEvent(true);
                }}
              >
                Add Event
              </Button>
              <Button
                sx={{
                  marginLeft: "10px",
                  backgroundColor: "#002200",
                }}
                variant="contained"
                onClick={handleSendServerNotMerge}
                disabled={dis}
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
            height="50vh"
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
      <HighlightReview
        getHighlight={getHighlight}
        highlights={highlights}
        mode={1}
      />
    </>
  );
};

export default VideoInput;
