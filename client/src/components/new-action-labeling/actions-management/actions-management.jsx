import { Button, TextField } from "@mui/material";

import "./actions-management.styles.scss";

const ActionsManagement = () => {
  return (
    <div className="actions-block">
      <div className="actions-title">
        <h2>ACTIONS MANAGEMENT</h2>
      </div>
      <div className="actions-new-btn">
        <Button variant="contained">ADD NEW ACTIONS</Button>
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
      <div className="actions-new">
        <div>ADD NEW ACTIONS</div>
        <div className="action-new-info">
          <div className="action-new-name">
            <div>Name</div>
            <div>
              <TextField fullWidth />
            </div>
          </div>
          <div className="action-new-description">
            <div>Description</div>
            <div>
              <TextField fullWidth />
            </div>
          </div>
        </div>
        <div className="action-new-info">
          <div className="action-new-name">
            <div>Name</div>
            <div>
              <TextField fullWidth />
            </div>
          </div>
          <div className="action-new-description">
            <div>Description</div>
            <div>
              <TextField fullWidth />
            </div>
          </div>
        </div>
        <div className="actions-add-btn">
          <Button variant="contained">Add Action</Button>
        </div>
        <div className="start-label-btn">
          <Button variant="contained">Start Labeling</Button>
        </div>
      </div>
    </div>
  );
};

export default ActionsManagement;
