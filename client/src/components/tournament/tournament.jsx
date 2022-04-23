import { useEffect, useRef, useState } from "react";

import {
  TextField,
  Card,
  Button,
  Grid,
  Snackbar,
  Alert,
  Link,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import DeleteIcon from "@mui/icons-material/Delete";
//import "./tournament.styles.scss";
import CustomCircularProgress from "../custom/custom-circular-progress";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomSelect from "../flugin/Select";
import { CustomDatePicker } from "../flugin";
import { useNavigate } from "react-router-dom";
import { FileUploader } from "react-drag-drop-files";

const Tournament = () => {
  const [opendialog, setOpenDialog] = useState(false);
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = useRef(null);

  const [tournament, setTournament] = useState();
  const [matchName, setMatchName] = useState();
  const [time, setTime] = useState();
  const [channel, setChannel] = useState();
  const [ip, setIp] = useState();
  const [port, setPort] = useState();

  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [file, setFile] = useState(null);

  let navigate = useNavigate();

  const handleDateChange = (date) => {
    setTime(date);
  };

  const handleTournamentChange = (e, value) => {
    setTournament(value);
  };

  const getMatches = async () => {
    try {
      const response = await videoEditingApi.getMatches();
      console.log(response.data);
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      tournamentId: tournament.id,
      matchName: matchName,
      mactchTime: time,
      channel: channel,
      ip: ip,
      port: port,
    };
    console.log(payload);
    const addTournament = async () => {
      try {
        const response = await videoEditingApi.addMatch(payload);
        if (response.status === 200 && response.data === "Succeed") {
          setNoti(true);
          setMessage("Saved");
          setTypeNoti("success");
          getMatches();
        }
      } catch (error) {
        setNoti(true);
        setMessage(error.response.description);
        setTypeNoti("error");
        console.log(error);
      }
    };
    addTournament();
  };

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const response = await videoEditingApi.getTournaments();
        setTournaments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
    getTournaments();
  }, []);

  const handleResultClick = (e, row) => {
    e.preventDefault();
    navigate("/video-edit", { state: { row } });
    console.log(row);
  };

  const handleDeleteClick = (e, row) => {
    const deleteMatch = async (id) => {
      try {
        await videoEditingApi.deleteMatch(id);
        setNoti(true);
        setMessage("Delete Succeed");
        setTypeNoti("success");
        getMatches();
      } catch (error) {
        console.log(error);
      }
    };
    deleteMatch(row.id);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleFileChange = (file) => {
    setFile(file);
    console.log(file);
  };
  return (
    <>
      <Dialog
        open={opendialog}
        onClose={handleClose}
        scroll={scroll}
        // fullWidth={true}
        // maxWidth="lg"
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
          <h4>Upload json file</h4>
          <Button variant="contained" onClick={handleClose}>
            Upload
          </Button>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <FileUploader
              handleChange={handleFileChange}
              name="file"
              types={["JSON"]}
            />
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

      <Card sx={{ padding: 5, margin: 20, marginTop: 0, marginBottom: 3 }}>
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid item xs={3}>
            Tournament
          </Grid>
          <Grid item xs={9}>
            <CustomSelect
              options={tournaments}
              labelRender="name"
              value={tournament}
              require={true}
              placeholder="Select or enter Tournament"
              onChange={handleTournamentChange}
            />
          </Grid>

          <Grid item xs={3}>
            Match
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={matchName}
              variant="outlined"
              size="small"
              onChange={(e) => setMatchName(e.target.value)}
              fullWidth
              required
              placeholder="Enter Match Name"
            />
          </Grid>

          <Grid item xs={3}>
            Time
          </Grid>
          <Grid item xs={9}>
            <CustomDatePicker value={time} onChange={handleDateChange} />
          </Grid>

          <Grid item xs={3}>
            Channel
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={channel}
              variant="outlined"
              size="small"
              onChange={(e) => setChannel(e.target.value)}
              fullWidth
              required
              placeholder="Enter Match Name"
            />
          </Grid>
          <Grid item xs={1}>
            IP
          </Grid>
          <Grid item xs={5}>
            <TextField
              value={ip}
              variant="outlined"
              size="small"
              onChange={(e) => setIp(e.target.value)}
              fullWidth
              required
              placeholder="Enter IP"
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2}>
            Port
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={port}
              variant="outlined"
              size="small"
              onChange={(e) => setPort(e.target.value)}
              fullWidth
              required
              placeholder="Enter Port"
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
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
              <b>Num</b>
            </TableCell>
            <TableCell
              key={1}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Tournament</b>
            </TableCell>
            <TableCell
              key={2}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Match</b>
            </TableCell>
            <TableCell
              key={3}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Time</b>
            </TableCell>
            <TableCell
              key={4}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Channel</b>
            </TableCell>
            <TableCell
              key={5}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>IP:Port</b>
            </TableCell>
            <TableCell
              key={6}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Video</b>
            </TableCell>
            <TableCell
              key={7}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            />
            <TableCell
              key={8}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {/* style={ {minHeight: '45px' } } */}
          {matches?.map((match, i) => (
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
                {match.tournametName}
              </TableCell>
              <TableCell
                key={3}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {match.matchName}
              </TableCell>
              <TableCell
                key={4}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {match.mactchTime}
              </TableCell>
              <TableCell
                key={5}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {match.channel}
              </TableCell>
              <TableCell
                key={6}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {`${match.ip}:${match.port}`}
              </TableCell>
              <TableCell
                key={7}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                <Link
                  href="#"
                  underline="none"
                  onClick={(e) => handleResultClick(e, match)}
                >
                  Result
                </Link>
              </TableCell>
              <TableCell
                key={9}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                <Tooltip
                  key={i}
                  title="Change/Upload Json file for match"
                  placement="top"
                >
                  <IconButton
                    onClick={() => {
                      setOpenDialog(true);
                    }}
                  >
                    <CloudUploadIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell
                key={8}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                <Tooltip key={i} title="Delete Match" placement="top">
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      handleDeleteClick(e, match);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {(matches === undefined || matches.length === 0) && (
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #76BBD9",
                }}
                align="center"
                colSpan={9}
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Tournament;
