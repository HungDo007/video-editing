import { useState } from "react";

import { Box, Button, Grid, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import "./actions-management.styles.scss";
import { Link } from "react-router-dom";

const ActionsManagement = () => {
  const [actions, setActions] = useState([
    {
      name: "",
      description: "",
    },
  ]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const action = [...actions];
    action[index][name] = value;
    setActions(action);
  };

  const handleAddAction = () => {
    setActions([...actions, { name: "", description: "" }]);
  };

  return (
    <div className="actions-block">
      <div className="actions-title">
        <h2>ACTIONS MANAGEMENT</h2>
      </div>
      <div className="actions-new-btn">
        <Button variant="contained" onClick={handleAddAction}>
          ADD NEW ACTIONS
        </Button>
      </div>
      <Grid container spacing={5}>
        <Grid item>
          <Box
            sx={{
              border: "3px solid #cdc7c7",
              margin: "1rem",
              padding: "0rem 1rem 1rem",
              width: 200,
            }}
          >
            <Box sx={{ ml: "2rem" }}>RUNNING</Box>
            <div>Description</div>
            <div>Created</div>
            <div>Status</div>
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              border: "3px solid #cdc7c7",
              margin: "1rem",
              padding: "0rem 1rem 1rem",
              width: 200,
            }}
          >
            <Box sx={{ ml: "2rem" }}>RUNNING</Box>
            <div>Description</div>
            <div>Created</div>
            <div>Status</div>
          </Box>
        </Grid>
      </Grid>
      {actions.length ? (
        <div className="actions-new">
          <div className="actions-close-btn">
            <IconButton onClick={() => setActions([])}>
              <CloseIcon />
            </IconButton>
          </div>
          <div>ADD NEW ACTIONS</div>
          {actions.map((action, index) => (
            <div key={index} className="action-new-info">
              <div className="action-new-name">
                <div>Name</div>
                <div>
                  <TextField
                    name="name"
                    value={action.name}
                    onChange={(event) => handleChange(event, index)}
                    fullWidth
                  />
                </div>
              </div>
              <div className="action-new-description">
                <div>Description</div>
                <div>
                  <TextField
                    name="description"
                    value={action.description}
                    onChange={(event) => handleChange(event, index)}
                    fullWidth
                  />
                </div>
              </div>
              {/* <div>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </div> */}
            </div>
          ))}
          <div className="actions-add-btn">
            <Button variant="contained" onClick={handleAddAction}>
              Add Action
            </Button>
          </div>
          <div className="start-label-btn">
            <Link to="actions-labeling">
              <Button variant="contained">Start Labeling</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ActionsManagement;
