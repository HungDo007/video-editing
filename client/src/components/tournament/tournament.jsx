import React from "react";

import { Select, MenuItem, TextField, Card } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import "./tournament.styles.scss";

const Tournament = () => {
  const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <div className="tournament-block">
      <div className="tournament-info">
        <Card sx={{ padding: 5 }}>
          <div className="tournament-field">
            <div>Tournament</div>
            <Select sx={{ width: 300 }} displayEmpty>
              <MenuItem>C1</MenuItem>
            </Select>
          </div>
          <div className="tournament-field">
            <div>Match</div>
            <TextField sx={{ width: 300 }} />
          </div>
          <div className="tournament-field">
            <div>Time</div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                value={value}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField sx={{ width: 300 }} {...params} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div className="tournament-field">
            <div>Channel</div>
            <TextField sx={{ width: 300 }} />
          </div>
          <div className="tournament-field">
            <div>IP</div>
            <TextField sx={{ width: 200 }} />
            <div>Port</div>
            <TextField sx={{ width: 100 }} />
          </div>
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
            <tr>
              <td>1</td>
              <td>C1</td>
              <td>Base-Real</td>
              <td>0:00</td>
              <td>Logo</td>
              <td>1.1.1.1 :32120</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tournament;
