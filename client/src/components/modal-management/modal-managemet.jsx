import { Box, Button, Card } from "@mui/material";

const ModalManagement = () => {
  return (
    <div>
      <Box>
        <h2>MODEL MANAGEMENT</h2>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Button variant="contained">Add New Model</Button>
      </Box>
      <Box sx={{ mt: 10 }}>
        <table>
          <tr>
            <th>Model ID</th>
            <th>Modal Name</th>
            <th>Actions</th>
            <th>Created Date</th>
            <th>Status</th>
          </tr>
          <tr>
            <td>1234</td>
            <td>Model 1</td>
            <td>
              <Box sx={{ display: "flex" }}>
                <Card sx={{ padding: "5px 10px", borderRadius: 5, mr: 2 }}>
                  Eating
                </Card>
                <Card sx={{ padding: "5px 10px", borderRadius: 5 }}>
                  Running
                </Card>
              </Box>
            </td>
            <td></td>
            <td>
              <div>Training</div>
            </td>
          </tr>
          <tr>
            <td>4567</td>
            <td>Model 2</td>
            <td>
              <div>Drinking</div>
            </td>
            <td></td>
            <td>
              <div>NotStarted</div>
            </td>
          </tr>
        </table>
      </Box>
    </div>
  );
};

export default ModalManagement;
