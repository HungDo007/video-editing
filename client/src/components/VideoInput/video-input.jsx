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
import { DialogDraggableLogo, DialogMoreEvent } from "../flugin";

export const formatTimeSlice = (time) => {
  var mind = time % (60 * 60);
  var minutes = Math.floor(time / 60);

  var secd = mind % 60;
  var seconds = Math.ceil(secd);
  return minutes + ":" + ("0" + seconds).slice(-2);
};

const VideoInput = () => {
  const [bitrate, setBitrate] = useState(1000);
  const [resolution, setResolution] = useState({ value: "1920:1080" });
  const [aspectRatio, setAspectRatio] = useState({ value: "3:2" });

  const [connection, setConnection] = useState();
  const [opendialog, setOpenDialog] = useState(false);

  const [hlSuccess, setHlSuccess] = useState();
  const [downloadOneSuccess, setDownloadOneSuccess] = useState();
  const location = useLocation();
  const videoPlayer = useRef(null);

  const descriptionElementRef = useRef(null);
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
  const [typeDraggable, setTypeDraggable] = useState();

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

      connection1.on("background_no_merge", (user, message) => {
        setHlSuccess(JSON.parse(message));
      });

      connection1.on("download_one", (user, message) => {
        setDownloadOneSuccess(JSON.parse(message));
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
    if (downloadOneSuccess) {
      setOpen(false);
      setOpen(false);
      // Create blob link to download
      const link = document.createElement("a");
      link.href = downloadOneSuccess.replace("raw", "download");
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      setDownloadOneSuccess();
    }
  }, [downloadOneSuccess]);

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
              logo: 0,
            };
            eventG.push(data);
          });
        }
        if (responseL.data.length > 0) {
          responseL.data.forEach((element, index) => {
            const data = {
              label: element.event,
              file_name: element.file_name,
              position: { x: 0, y: 0 },
              size: [
                Math.floor(element.width / 2),
                Math.floor(element.height / 2),
              ],
              selected: false,
            };
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

  const handelCheckLogo = (checked, logoSelected) => {
    const temp = [...logoGallery];
    const idx = temp.findIndex(
      (item) => item.file_name === logoSelected.file_name
    );
    temp[idx].selected = checked;
    setLogoGallery(temp);
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
    const temp = [...logoGallery];

    const lggg = temp.reduce((logoSent, tempLogo) => {
      if (tempLogo.selected) {
        const logoSentItem = {
          position: tempLogo.position,
          file_name: tempLogo.file_name,
          size: tempLogo.size,
        };
        logoSent.push(logoSentItem);
      }
      return logoSent;
    }, []);

    const newBitrate = bitrate ? bitrate : "1000";
    setBitrate(newBitrate);
    const newBody = {
      ...body,
      event: filtered,
      logo: lggg,
      aspect_ratio: aspectRatio.value,
      resolution: resolution.value,
      bitrate: newBitrate.toString(),
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
      logo: [],
    };

    const downloadOne = async () => {
      try {
        await videoEditingApi.downloadOne(
          location.state.row.id,
          hlDescription,
          newBody
        );
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    downloadOne();
  };

  const downloadNoMerge = (files) => {
    download_files(files);
  };

  function download_files(files) {
    function download_next(i) {
      if (i >= files?.length) {
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
      }, 2000);
    }
    // Initiate the first download.
    download_next(0);
  }

  const handleSendServerNotMerge = () => {
    const temp = [...logoGallery];
    const lgg = temp.filter((l) => l.position.x > 0);

    const newBitrate = bitrate ? bitrate : "1000";
    setBitrate(newBitrate);
    const newBody = {
      ...body,
      event: filtered,
      logo: lgg,
      aspect_ratio: aspectRatio.value,
      resolution: resolution.value,
      bitrate: newBitrate.toString(),
    };

    const downloadNotMerge = async () => {
      try {
        await videoEditingApi.downloadNotMerge(
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
    if (row.selected !== 1) {
      newVideoSrc[vdSrc].selected = 1;
    }
    setVideoSrc(newVideoSrc);
  };

  const onCheckOne = (checked, record) => {
    const newVideoSrc = [...videoSrc];
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === record.file_name
    );
    newVideoSrc[vdSrc].selected = checked ? 1 : 0;
    setVideoSrc(newVideoSrc);
    updateLogTrimmed(newVideoSrc[vdSrc]);
  };

  const onCheckAll = (checked, filteredInfo) => {
    var temp = [...videoSrc];
    const payload = temp.reduce((filtered, video) => {
      var tempVideo = { ...video };

      if (filteredInfo?.event !== null || filteredInfo?.level !== null) {
        if (filteredInfo.level !== null && filteredInfo.event !== null) {
          if (
            filteredInfo.event.includes(tempVideo.event) &&
            filteredInfo.level.includes(tempVideo.level)
          ) {
            tempVideo.selected = checked ? 1 : 0;
            filtered.push(tempVideo);
          } else {
            tempVideo.selected = 0;
            filtered.push(tempVideo);
          }
          return filtered;
        } else if (filteredInfo.level === null) {
          if (filteredInfo.event.includes(tempVideo.event)) {
            tempVideo.selected = checked ? 1 : 0;
            filtered.push(tempVideo);
          } else {
            tempVideo.selected = 0;
            filtered.push(tempVideo);
          }
          return filtered;
        } else {
          if (filteredInfo.level.includes(tempVideo.level)) {
            tempVideo.selected = checked ? 1 : 0;
            filtered.push(tempVideo);
          } else {
            tempVideo.selected = 0;
            filtered.push(tempVideo);
          }
          return filtered;
        }
      } else {
        tempVideo.selected = checked ? 1 : 0;
        filtered.push(tempVideo);
        return filtered;
      }
    }, []);

    setVideoSrc(payload);

    // const updateAll = async () => {
    //   try {
    //     await videoEditingApi.updateAll(location.state.row.id, checked ? 1 : 0);
    //   } catch (error) {}
    // };
    // updateAll();
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

  const onTrack = (lg, newPos) => {
    const temp = [...logoGallery];
    const idx = temp.findIndex((l) => l.file_name === lg.file_name);
    temp[idx].position = newPos;
    setLogoGallery(temp);
  };

  const onResize = (lg, newSize) => {
    const temp = [...logoGallery];
    const idx = temp.findIndex((l) => l.file_name === lg.file_name);
    let newNewSize = [...newSize];
    newNewSize[1] = (newSize[0] * temp[idx].size[1]) / temp[idx].size[0];
    temp[idx].size = newNewSize;
    setLogoGallery(temp);
  };

  const handleCheckLogo = (row, e) => {
    const temp = [...filtered];
    const idx = temp.findIndex((l) => l.file_name === row.file_name);
    temp[idx].logo = e.target.checked ? 1 : 0;
    setFiltered(temp);
  };

  const handleLogoCheckAll = (e) => {
    const temp = [...filtered];
    temp.forEach((item) => {
      item.logo = e.target.checked ? 1 : 0;
    });
    setFiltered(temp);
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

      <DialogDraggableLogo
        type={typeDraggable}
        open={opendialogUploadLogo}
        handleClose={handleClose1}
        logo={logoGallery}
        onTrack={onTrack}
        onResize={onResize}
        handelCheckLogo={handelCheckLogo}
      />

      <Dialog open={opendialog} onClose={handleClose} scroll="paper" fullScreen>
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
              logo={logoGallery}
              onCheck={handleCheckLogo}
              logoCheckAll={handleLogoCheckAll}
              aspectRatio={aspectRatio}
              resolution={resolution}
              bitrate={bitrate}
              setAspectRatio={setAspectRatio}
              setResolution={setResolution}
              setBitrate={setBitrate}
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
              {/* <Button
                sx={{
                  backgroundColor: "#996699",
                }}
                variant="contained"
                onClick={() => {
                  setTypeDraggable("frame");
                  setOpendialogUploadLogo(true);
                }}
              >
                Add Frame
              </Button> */}
              <Button
                sx={{
                  backgroundColor: "#996699",
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={() => {
                  setTypeDraggable("logo");
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
              <Button
                sx={{
                  backgroundColor: "red",
                  marginLeft: "10px",
                }}
                variant="contained"
                onClick={handleClose}
              >
                Cancel
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
            onCheckOne={onCheckOne}
            onCheckAll={onCheckAll}
            buttonReview={
              <Button variant="contained" onClick={handleEditVideo}>
                Review
              </Button>
            }
          />
        </Grid>
      </Grid>
      <div
        style={{ height: 3, backgroundColor: "black", marginBottom: "15px" }}
      ></div>
      <HighlightReview
        getHighlight={getHighlight}
        highlights={highlights}
        mode={1}
        downloadNoMerge={downloadNoMerge}
      />
    </>
  );
};

export default VideoInput;
