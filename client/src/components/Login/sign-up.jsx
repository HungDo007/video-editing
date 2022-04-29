import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./bg.jpg";

const style = {
  backgroundImage: `url(${background})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  display: "flex",
  flexFlow: "row",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
};

function SignUp() {
  const [err, setErr] = useState(false);
  const [suc, setSuc] = useState(false);
  const [time, setTime] = useState(3);
  let navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErr(false);
  };
  const handleSucClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErr(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuc(true);
      setTimeout(() => {
        setTime(2);
        setTimeout(() => {
          setTime(1);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };
  return (
    <div style={style}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={suc}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleSucClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sign up succeed! Go to Login after {time}s
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={err}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <Paper
        sx={{
          padding: "40px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "30px",
        }}
      >
        <Typography
          sx={{
            color: "#408DBA",
            textAlign: "center",
          }}
          variant="h5"
          component="h1"
        >
          <b>Video App</b>
        </Typography>

        <Grid
          sx={{
            mt: "20px",
            width: "45vw",
            minWidth: "300px",
          }}
          container
          spacing={2}
          component="form"
          onSubmit={handleSubmit}
          autoComplete="false"
        >
          {/* <Grid item xs={12} hidden={!checkInfo}>
            <Typography>
              <b>Xin chào, {localStorage.getItem("fullName") || ""}</b>
            </Typography>
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            mt={3}
            alignItems="center"
            display="flex"
            position="relative"
          >
            <Button
              variant="contained"
              sx={{
                paddingLeft: "70px",
                paddingRight: "70px",
                margin: "auto",
                backgroundColor: "#408DBA",
              }}
              disabled={loading}
              type="submit"
            >
              Sign Up
            </Button>
            {loading && (
              <CircularProgress
                size={25}
                sx={{
                  color: "blue",
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                textAlign: "center",
                color: "#408DBA",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Back to Login
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default SignUp;
