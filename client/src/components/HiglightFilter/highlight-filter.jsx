import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useRef, useState } from "react";
import TableEditVideo from "../VideoInput/TableEditVideo";
import { useEffect } from "react";
import videoEditingApi from "../../api/video-editing";
import { formatTimeSlice } from "../VideoInput/video-input";
import ReactPlayer from "react-player";
import TableReview from "../VideoInput/TableReview";
import HighlightReview from "../highlight-review";
import { DialogDraggableLogo, DialogMoreEvent } from "../flugin";
import CustomizedSlider from "../VideoInput/Silder";

function HighlightFilter() {
  const [bitrate, setBitrate] = useState("1000");
  const [resolution, setResolution] = useState({
    label: "1080p",
    value: "1920:1080",
  });

  const [connection, setConnection] = useState();
  const [filtered, setFiltered] = useState([]);

  const [hlSuccess, setHlSuccess] = useState();

  const [highlights, setHighlights] = useState([]);
  const [hlDescription, setHlDescription] = useState();

  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState([]);

  const [opendialog, setOpenDialog] = useState(false);
  const descriptionElementRef = useRef(null);
  const [typeDraggable, setTypeDraggable] = useState("logo");
  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [tagName, setTagName] = useState();
  const [optTagName, setOptTagName] = useState();

  const [open, setOpen] = useState(false);

  const [videoSrc, setVideoSrc] = useState([]);

  const [duration, setDuration] = useState(0);
  const [isTrimmed, setIsTrimmed] = useState(true);
  const [rowSelected, setRowSelected] = useState();
  const [videoPieceTime, setVideoPieceTime] = useState([0, 0]);

  const [isReady, setIsReady] = useState(false);

  const videoPlayer = useRef(null);
  const previousVideoPieceTime = useRef(videoPieceTime);
  const previousDataRow = useRef(rowSelected);

  const [eventGallery, setEventGallery] = useState();
  const [logoGallery, setLogoGallery] = useState();
  const [openDialogMoreEvent, setOpenDialogMoreEvent] = useState(false);
  const [openDialogMoreLogo, setOpenDialogMoreLogo] = useState(false);

  const getHighlight = async () => {
    try {
      var response = await videoEditingApi.getHighlightHL();
      setHighlights(response.data);
    } catch (error) {
      console.log(error.response);
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
    const getTeamNameList = async () => {
      try {
        var response = await videoEditingApi.getTeamNameList(tournament?.id);
        setTeams(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    setTeams([]);
    getTeamNameList();
  }, [tournament]);
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
    const getTournaments = async () => {
      try {
        const response = await videoEditingApi.getTournaments();
        //const data = [...tempTournaments, ...response.data];
        setTournaments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getTagNameList = async () => {
      try {
        var response = await videoEditingApi.getTagNameList();
        setOptTagName(response.data);
      } catch (error) {
        console.log(error);
      }
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
              selected: 0,
            };
            logoG.push(data);
          });
        }
        setLogoGallery(logoG);
        setEventGallery(eventG);
      } catch {}
    };

    join();
    getGallery();
    getTagNameList();
    getHighlight();
    getTournaments();
    return () => {
      try {
        connection.stop();
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  useEffect(() => {
    setVideoPieceTime([rowSelected?.startTime, rowSelected?.endTime]);
    videoPlayer.current?.seekTo(rowSelected?.startTime, "seconds");
  }, [rowSelected]);

  useEffect(() => {
    previousVideoPieceTime.current = videoPieceTime;
  }, [videoPieceTime]);

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

  const handleIconRemoveEventClick = (row) => {
    const temp = [...filtered];
    const afterRemove = temp.filter((item) => item.file_name !== row.file_name);
    setFiltered(afterRemove);
  };

  const handleEditVideo = () => {
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

  const handleSearchVideo = (e) => {
    e.preventDefault();
    const body = {
      dateFrom: fromDate
        .toLocaleString("sv", { timeZoneName: "short" })
        .substring(0, 10),
      dateTo: toDate
        .toLocaleString("sv", { timeZoneName: "short" })
        .substring(0, 10),
      tagName: tagName.tagName,
      tournamentId: tournament.id,
      teams: team,
    };
    const getJsonFileFromTagName = async () => {
      try {
        var response = await videoEditingApi.getJsonFileFromTagName(body);
        if (response.data.length > 0) {
          response.data[0].selected = 1;
          setVideoSrc(response.data);
          setRowSelected(response.data[0]);
        } else {
          setNoti(true);
          setMessage("No data");
          setTypeNoti("info");
        }
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
        console.log(error);
      }
    };
    setVideoSrc([]);
    setRowSelected(undefined);
    getJsonFileFromTagName();
  };

  const onCheckOne = (checked, record) => {
    const newVideoSrc = [...videoSrc];
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === record.file_name
    );
    newVideoSrc[vdSrc].selected = checked ? 1 : 0;
    setVideoSrc(newVideoSrc);
  };

  const onCheckAll = (checked, filteredInfo) => {
    var temp = [...videoSrc];
    console.log(filteredInfo, checked);
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

  const handleDuration = (duration) => {
    previousDataRow.current = rowSelected;
    setDuration(duration);
  };

  const onReady = useCallback(
    (rowSelected) => {
      if (!isReady) {
        videoPlayer.current.seekTo(rowSelected?.startTime, "seconds");
        setIsReady(true);
      }
    },
    [isReady]
  );

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handelCheckLogo = (checked, logoSelected) => {
    const temp = [...logoGallery];
    const idx = temp.findIndex(
      (item) => item.file_name === logoSelected.file_name
    );
    temp[idx].selected = checked;
    setLogoGallery(temp);
  };

  const mergeVideoHL = (e) => {
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
    const body = {
      event: filtered,
      logo: lggg,
      description: hlDescription,
      resolution: resolution.value,
      bitrate: newBitrate.toString(),
    };
    const mergeHL = async () => {
      try {
        await videoEditingApi.mergeHL(body);
        setOpen(false);
        setNoti(true);
        setMessage("Consolidation in progress");
        setTypeNoti("success");
        handleClose();
        getHighlight();
      } catch (error) {
        setOpen(false);
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    setOpen(true);
    mergeHL();
  };

  const handleCloseEventAndLogo = () => {
    setOpenDialogMoreEvent(false);
    setOpenDialogMoreLogo(false);
  };

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

      <DialogMoreEvent
        open={openDialogMoreEvent}
        handleClose={handleCloseEventAndLogo}
        onCheck={onCheck}
        eventGallery={eventGallery}
      />

      <DialogDraggableLogo
        fileName={filtered[0] ? filtered[0].file_name : ""}
        type={typeDraggable}
        open={openDialogMoreLogo}
        handleClose={handleCloseEventAndLogo}
        logo={logoGallery}
        onTrack={onTrack}
        onResize={onResize}
        handelCheckLogo={handelCheckLogo}
      />

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 100000000,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
              resolution={resolution}
              bitrate={bitrate}
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
            onSubmit={mergeVideoHL}
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <Button
                sx={{
                  backgroundColor: "#996699",
                }}
                variant="contained"
                onClick={() => {
                  setTypeDraggable("frame")
                  setOpenDialogMoreLogo(true);
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
                  setOpenDialogMoreLogo(true);
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
                  setOpenDialogMoreEvent(true);
                }}
              >
                Add Event
              </Button>

              <Button
                sx={{
                  marginLeft: "10px",
                }}
                variant="contained"
                type="submit"
                disabled={filtered?.length > 0 ? false : true}
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

      <Grid container spacing={2} component="form" onSubmit={handleSearchVideo}>
        <Grid item xs={2.2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="From date"
              inputFormat="dd/MM/yyyy"
              value={fromDate}
              onChange={(date) => setFromDate(date)}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2.2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="To date"
              inputFormat="dd/MM/yyyy"
              value={toDate}
              onChange={(date) => setToDate(date)}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2.2}>
          <Autocomplete
            //multiple
            options={tournaments ? tournaments : []}
            size="small"
            //disableCloseOnSelect
            value={tournament || null}
            fullWidth
            //limitTags={1}
            getOptionLabel={(option) => option["name"] || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="League name"
                placeholder={"Select league name"}
                required
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, value) => setTournament(value)}
          />
        </Grid>
        <Grid item xs={2.2}>
          <Autocomplete
            multiple
            options={teams ? teams : []}
            size="small"
            value={team || null}
            disableCloseOnSelect
            fullWidth
            limitTags={1}
            multiline={false}
            getOptionLabel={(option) => option["teamName"] || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Team"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            onChange={(e, value) => setTeam(value)}
          />
        </Grid>
        <Grid item xs={2.2}>
          <Autocomplete
            options={optTagName}
            size="small"
            value={tagName || null}
            fullWidth
            getOptionLabel={(option) => option["tagName"] || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Event Name"
                placeholder="Select Event Name"
                required
                inputProps={{ ...params.inputProps }}
              />
            )}
            onChange={(e, value) => setTagName(value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" type="submit" color="success">
            <SearchIcon />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <div style={{ height: "1.5px", backgroundColor: "grey" }}></div>
        </Grid>
        <Grid item xs={12} display="flex">
          <Grid item xs={6}>
            <TableEditVideo
              data={videoSrc}
              height="55vh"
              onCheckOne={onCheckOne}
              onCheckAll={onCheckAll}
              onTableClick={onTableClick}
              buttonReview={
                <Button variant="contained" onClick={handleEditVideo}>
                  View
                </Button>
              }
            />
          </Grid>
          {rowSelected && (
            <Grid item xs={6}>
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

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "720px",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <CustomizedSlider
                      duration={duration}
                      videoPieceTime={videoPieceTime}
                      handleSlideChange={handleSlideChange}
                    />
                    {/* <Slider
                      min={0}
                      max={duration}
                      value={videoPieceTime}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(s) => {
                        return formatTimeSlice(s);
                      }}
                      onChange={handleSlideChange}
                    /> */}
                  </Box>
                  <Box
                    sx={{
                      marginBottom: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>{formatTimeSlice(rowSelected?.startTime)}</div>
                    <div>{formatTimeSlice(rowSelected?.endTime)}</div>
                  </Box>
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <HighlightReview
            getHighlight={getHighlight}
            highlights={highlights}
            mode={2}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default HighlightFilter;
