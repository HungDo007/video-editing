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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "./bg.jpg";
import { userApi } from "../../api";

function isAllPresent(str) {
  // Regex to check if a string
  // contains uppercase, lowercase
  // special character & numeric value
  var pattern = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
  );

  // If the string is empty
  // then print No
  if (!str || str.length < 8) {
    //không đử độ dài
    return true;
  }

  // Print Yes If the string matches
  // with the Regex
  if (pattern.test(str)) {
    //thỏa điều kiện
    return false;
  } else {
    //không thỏa đk
    return true;
  }
}

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
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errPassword, setErrPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState();
  const [errConfirmPassword, setConfirmErrPassword] = useState(false);

  const [errForm, setErrForm] = useState(false);
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

  useEffect(() => {
    if (errPassword || errConfirmPassword) {
      setErrForm(true);
    } else {
      setErrForm(false);
    }
  }, [errPassword, errConfirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errForm) {
      setLoading(true);
      const body = {
        username,
        email,
        fullName,
        password,
      };
      const signUp = async () => {
        try {
          await userApi.signUp(body);
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
        } catch (error) {
          setLoading(false);
          setErr(true);
          setMessage(error.response.data.description);
        }
      };
      signUp();
    } else {
      setErr(true);
      setMessage("Please meet the conditions");
    }
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setErrPassword(isAllPresent(e.target.value));
                if (confirmPassword !== undefined) setConfirmErrPassword(true);
              }}
              error={errPassword}
              helperText={
                errPassword
                  ? "Password must contain at least one numeric character, uppercase letter, lowercase character and special character"
                  : ""
              }
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
              error={errConfirmPassword}
              helperText={errConfirmPassword ? "Two passwords don't match" : ""}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmErrPassword(password !== e.target.value);
              }}
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
