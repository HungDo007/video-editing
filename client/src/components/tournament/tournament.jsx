import { useEffect, useState } from "react";

import {
  CircularProgress,
  Select,
  MenuItem,
  TextField,
  Card,
  Button,
  Box,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import videoEditingApi from "../../api/video-editing";
import "./tournament.styles.scss";
import CustomCircularProgress from "../custom/custom-circular-progress";

const Tournament = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [tournamentInfo, setTournamentInfo] = useState({
    tournamentId: "",
    matchName: "",
    matchTime: new Date("2022-01-01T00:00:00"),
    channel: "",
    ip: "",
    port: "",
  });

  const { tournamentId, matchName, matchTime, channel, ip, port } =
    tournamentInfo;

  const handleDateChange = (date) => {
    setTournamentInfo({ ...tournamentInfo, matchTime: date });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setTournamentInfo({ ...tournamentInfo, [name]: value });
  };

  const getMatches = async () => {
    try {
      const response = await videoEditingApi.getMatches();
      // console.log(response);
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      tournamentId: tournamentId,
      matchName: matchName,
      mactchTime: matchTime,
      channel: channel,
      ip: ip,
      port: port,
    };

    const addTournament = async () => {
      try {
        const response = await videoEditingApi.addMatch(payload);
        // console.log(response);
        if (response.status === 200 && response.data === "Succeed") {
          getMatches();
        }
      } catch (error) {
        console.log(error);
      }
    };

    addTournament();
  };

  useEffect(() => {
    const getTournaments = async () => {
      try {
        const response = await videoEditingApi.getTournaments();
        //console.log(response);
        setTournaments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMatches();
    getTournaments();
  }, []);

  return (
    <>
      {matches.length ? (
        <div className="tournament-block">
          <div className="tournament-info">
            <Card sx={{ padding: 5 }} component="form" onSubmit={handleSubmit}>
              <div className="tournament-field">
                <div>Tournament</div>
                <Select
                  name="tournamentId"
                  value={tournamentId}
                  defaultValue={tournamentId}
                  onChange={handleInputChange}
                  sx={{ width: 300 }}
                >
                  {tournaments.map((tour) => (
                    <MenuItem key={tour.id} value={tour.id}>
                      {tour.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="tournament-field">
                <div>Match</div>
                <TextField
                  sx={{ width: 300 }}
                  name="matchName"
                  value={matchName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="tournament-field">
                <div>Time</div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    value={matchTime}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField sx={{ width: 300 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
              <div className="tournament-field">
                <div>Channel</div>
                <TextField
                  sx={{ width: 300 }}
                  name="channel"
                  value={channel}
                  onChange={handleInputChange}
                />
              </div>
              <div className="tournament-field">
                <div>IP</div>
                <TextField
                  sx={{ width: 200 }}
                  name="ip"
                  value={ip}
                  onChange={handleInputChange}
                />
                <div>Port</div>
                <TextField
                  sx={{ width: 100 }}
                  name="port"
                  value={port}
                  onChange={handleInputChange}
                />
              </div>
              <Box sx={{ textAlign: "center" }}>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Box>
            </Card>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Num</th>
                  <th>Tournament</th>
                  <th>Match</th>
                  <th>Time</th>
                  <th>Chanel</th>
                  <th>IP:Port</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => (
                  <tr key={match.id}>
                    <td>{index + 1}</td>
                    <td>{match.tournametName}</td>
                    <td>{match.matchName}</td>
                    <td>{match.mactchTime}</td>
                    <td>{match.channel}</td>
                    <td>{`${match.ip}:${match.port}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <CustomCircularProgress />
      )}
    </>
  );
};

export default Tournament;
