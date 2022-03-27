import { Card } from "@mui/material";

const CustomCard = ({ children, background, ...otherProps }) => (
  <Card
    sx={{
      backgroundColor: background,
      color: "white",
      padding: "5px 10px",
      fontWeight: "bold",
      borderRadius: 5,
      margin: "0px 5px",
    }}
    {...otherProps}
  >
    {children}
  </Card>
);

export default CustomCard;
