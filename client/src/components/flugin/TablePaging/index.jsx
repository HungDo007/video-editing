import { MenuItem, Select } from "@mui/material";
import React from "react";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";

function TablePagination(props) {
  const { rowsPerPage, handleChangeRowsPerPage, count, page, onPageChange } =
    props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        value={rowsPerPage}
        onChange={handleChangeRowsPerPage}
        size="small"
        style={{ fontSize: "0.9rem" }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={-1}>Tất cả</MenuItem>
      </Select>
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
          <KeyboardArrowLeft />
        </IconButton>
        {/* <small> */}
        {page + 1}/
        {Math.max(0, Math.ceil(count / rowsPerPage)) === 0
          ? 1
          : Math.max(0, Math.ceil(count / rowsPerPage))}
        {/* </small> */}
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <LastPageIcon />
        </IconButton>
        {/* <small> */}
        Total: {count}
        {/* </small> */}
      </Box>
    </div>
  );
}

export default TablePagination;
