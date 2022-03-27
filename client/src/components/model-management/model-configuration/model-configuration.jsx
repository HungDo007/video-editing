import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";

const ModelConfiguration = () => {
  return (
    <div>
      <div>
        <h2>MODEL CONFIGURATION</h2>
      </div>
      <div>
        <Box sx={{ margin: "20px 0px" }}>
          <div>Select Modal</div>
          <Select sx={{ width: 400 }}></Select>
        </Box>
        <TextField defaultValue="Last updated at..." />
        <Box sx={{ margin: "20px 0px" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>Number of Actions</Grid>
            <Grid item>
              <Select displayEmpty sx={{ width: 200 }}>
                <MenuItem>3</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid item>
            <div>
              <Select displayEmpty sx={{ width: 200 }}>
                <MenuItem>Eating</MenuItem>
              </Select>
            </div>
            <div>
              <TextField defaultValue="Eating ice cream" />
            </div>
            <div>
              <TextField defaultValue="Eating ice noddles" />
            </div>
          </Grid>
          <Grid item>
            <Select displayEmpty sx={{ width: 200 }}>
              <MenuItem>Drinking</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Select displayEmpty sx={{ width: 200 }}>
              <MenuItem>Driving</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <IconButton
              sx={{
                border: "2px dashed grey",
                borderRadius: "inherit",
                width: 180,
                height: 120,
              }}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ margin: "20px 0px" }}>
          <Grid container spacing={5}>
            <Grid item>
              <div>Number Of GPUs</div>
              <Select sx={{ width: 300 }}></Select>
            </Grid>
            <Grid item>
              <div>Train batch size</div>
              <Select sx={{ width: 300 }}></Select>
            </Grid>
            <Grid item>
              <div>Test batch size</div>
              <Select sx={{ width: 300 }}></Select>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div>
        <Box sx={{ display: "flex" }}>
          <h2>ADVANCED</h2>
          <Switch />
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
          <h3>TRAIN</h3>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <div>Enable</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Dataset</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Batch Size</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Eval Period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Check point period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Auto Resume</div>
              <Select displayEmpty sx={{ width: 200 }}>
                <MenuItem>False</MenuItem>
                <MenuItem>True</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
          <h3>DATA</h3>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <div>Enable</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Dataset</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Batch Size</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Eval Period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Check point period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Auto Resume</div>
              <Select displayEmpty sx={{ width: 200 }}>
                <MenuItem>False</MenuItem>
                <MenuItem>True</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
          <h3>SLOWFAST</h3>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <div>Enable</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Dataset</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Batch Size</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Eval Period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Check point period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Auto Resume</div>
              <Select displayEmpty sx={{ width: 200 }}>
                <MenuItem>False</MenuItem>
                <MenuItem>True</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
          <h3>NONLOCAL</h3>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <div>Enable</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Dataset</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Batch Size</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <div>Eval Period</div>
              <Select sx={{ width: 200 }}></Select>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default ModelConfiguration;
