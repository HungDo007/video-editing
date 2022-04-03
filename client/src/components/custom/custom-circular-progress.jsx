import { CircularProgress, Box } from "@mui/material";

const CustomCircularProgress = () => (
  <Box
    sx={{
      height: "50vh",
      display: "flex",
      minWidth: "300px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress style={{ height: "80px", width: "80px" }} />
  </Box>
);

export default CustomCircularProgress;
