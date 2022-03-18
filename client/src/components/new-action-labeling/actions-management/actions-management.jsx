import { useState } from "react";

import { Button, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import "./actions-management.styles.scss";

const ActionsManagement = () => {
  const [status, setStatus] = useState(false);
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
      <div className="actions-running">
        <div className="actions-running-detail">
          <div className="actions-status">RUNNING</div>
          <div>Description</div>
          <div>Created</div>
          <div>Status</div>
        </div>
        <div className="actions-running-detail">
          <div className="actions-status">RUNNING</div>
          <div>Description</div>
          <div>Created</div>
          <div>Status</div>
        </div>
      </div>
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
            <Button variant="contained">Start Labeling</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ActionsManagement;
