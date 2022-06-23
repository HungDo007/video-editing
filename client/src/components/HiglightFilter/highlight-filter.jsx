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
  Slider,
  Snackbar,
  TextField,
} from "@mui/material";
import { Tabs } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import React, { useCallback, useRef, useState } from "react";
import TableEditVideo from "../VideoInput/TableEditVideo";
import { useEffect } from "react";
import videoEditingApi from "../../api/video-editing";
import { formatTimeSlice } from "../VideoInput/video-input";
import ReactPlayer from "react-player";
import TableReview from "../VideoInput/TableReview";
import TableLogo from "../VideoInput/TableLogo";
import { DialogUploadEvent, DialogUploadLogo } from "../flugin";
import HighlightReview from "../highlight-review";
const { TabPane } = Tabs;

function HighlightFilter() {
  const [connection, setConnection] = useState();
  const [filtered, setFiltered] = useState([]);
  const [logo, setLogo] = useState([]);

  const [highlights, setHighlights] = useState([]);
  const [hlDescription, setHlDescription] = useState();

  const [tournaments, setTournaments] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState([]);

  const [opendialog, setOpenDialog] = useState(false);
  const [position, setPosition] = useState(undefined);
  const [eventName, setEventName] = useState(undefined);
  const descriptionElementRef = useRef(null);
  const [opendialogUploadEvent, setOpendialogUploadEvent] = useState(false);
  const [opendialogUploadLogo, setOpendialogUploadLogo] = useState(false);
  const [file, setFile] = useState();

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

  const getHighlight = async () => {
    try {
      var response = await videoEditingApi.getHighlightHL();
      setHighlights(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

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

    const join = async () => {
      try {
        const connection1 = new HubConnectionBuilder()
          .withUrl(process.env.REACT_APP_BASE_NOTI_URL)
          .configureLogging(LogLevel.Information)
          .build();

        connection1.on("noti", (user, message) => {
          console.log(user, message);
          getHighlight();
        });
        await connection1.start();
        await connection1.invoke("JoinRoom", {
          user: localStorage.getItem("username"),
          room: localStorage.getItem("username"),
        });
        setConnection(connection1);
      } catch (e) {
        console.log(e);
      }
    };

    join();

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
    console.log(vdSrc);
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

  const handleIconRemoveLogoClick = (position) => {
    const temp = [...logo];
    const afterRemove = temp.filter((item) => item[1] !== position);
    setLogo(afterRemove);
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
    console.log(tournament, team);
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
        console.log(response.data.length);
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

  const handleNotQualifiedOrTrimmedClick = () => {
    const newVideoSrc = [...videoSrc];
    const vdSrc = newVideoSrc.findIndex(
      (vid) => vid.file_name === rowSelected.file_name
    );
    newVideoSrc[vdSrc].selected = isTrimmed ? 0 : 1;
    setIsTrimmed(!isTrimmed);
    setVideoSrc(newVideoSrc);
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
    setOpendialogUploadEvent(false);
    setOpendialogUploadLogo(false);
  };

  const handleClose1 = () => {
    setOpendialogUploadEvent(false);
    setOpendialogUploadLogo(false);
  };

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

    if (logo.some((lg) => lg[1] == position.value)) {
      setNoti(true);
      setMessage("Logo in this position already exists");
      setTypeNoti("error");
    } else {
      const formdata = new FormData();
      formdata.append("eventName", null);
      formdata.append("file", file);
      formdata.append("position", position.value);

      try {
        const uploadLogo = async () => {
          var response = await videoEditingApi.uploadLogoHL(formdata);
          console.log(response);
          const temp = [...logo];
          temp.unshift(response.data);
          setLogo(temp);
          setOpen(false);
          setNoti(true);
          setMessage("Upload Succeed");
          setTypeNoti("success");
          setOpendialogUploadLogo(false);
        };
        setOpen(true);
        uploadLogo();
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    }
  };

  const handleFileChange = (file) => {
    setFile(file);
  };
  const mergeVideoHL = (e) => {
    e.preventDefault();
    const body = {
      event: filtered,
      logo: logo,
      description: hlDescription,
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

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 100000000,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <DialogUploadEvent
        open={opendialogUploadEvent}
        handleClose={handleClose1}
        handleUploadEventClick={handleUploadEventClick}
        eventName={eventName}
        setEventName={setEventName}
        handleFileChange={handleFileChange}
      />

      <DialogUploadLogo
        open={opendialogUploadLogo}
        handleClose={handleClose1}
        handleUploadLogoClick={handleUploadLogoClick}
        position={position}
        setPosition={setPosition}
        handleFileChange={handleFileChange}
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
                type="submit"
                //onClick={mergeVideoHL}
                disabled={filtered?.length > 0 ? false : true}
              >
                Merge
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
