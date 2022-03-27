import { Box, Button, Card } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import CustomCard from "../custom/custom-card";

const ModelManagement = () => {
  return (
    <div>
      <Box>
        <h2>MODEL MANAGEMENT</h2>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Link to="configuration">
          <Button variant="contained">Add New Model</Button>
        </Link>
      </Box>
      <Box sx={{ mt: 10 }}>
        <table>
          <thead>
            <tr>
              <th>Model ID</th>
              <th>Modal Name</th>
              <th>Actions</th>
              <th>Created Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1234</td>
              <td>Model 1</td>
              <td>
                <Box sx={{ display: "flex" }}>
                  <CustomCard background="gray">Eating</CustomCard>
                  <CustomCard background="gray">Running</CustomCard>
                </Box>
              </td>
              <td></td>
              <td>
                <CustomCard background="green">Training</CustomCard>
              </td>
            </tr>
            <tr>
              <td>4567</td>
              <td>Model 2</td>
              <td>
                <Box sx={{ display: "flex" }}>
                  <CustomCard background="gray">Drinking</CustomCard>
                </Box>
              </td>

              <td></td>
              <td>
                <Box sx={{ display: "flex" }}>
                  <CustomCard background="#9faeb3">Not Started</CustomCard>
                </Box>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default ModelManagement;
