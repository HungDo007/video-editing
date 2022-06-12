import { IconButton } from "@mui/material";
import { Table, Tooltip } from "antd";
import React from "react";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircleOutline";

function TableLogo(props) {
  const { data, handleIconRemoveClick } = props;

  const columns = [
    {
      title: "Logo",
      width: 200,
      render: (row) => {
        const url = row[0];
        return <img src={url} width="100%" alt="Error to load" />;
      },
    },
    {
      title: "Position",
      render: (row) => {
        const positionNum = row[1];
        let positionName;
        if (positionNum === "1") positionName = "Top-Right";
        else if (positionNum === "2") positionName = "Bottom-Right";
        else if (positionNum === "3") positionName = "Bottom-Left";
        else if (positionNum === "4") positionName = "Top-Left";

        return positionName;
      },
    },
    {
      title: "Remove",
      width: 100,
      render: (row) => {
        return (
          <Tooltip key={123} title="Remove logo" placement="top">
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                handleIconRemoveClick(row[1]);
              }}
            >
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      pagination={false}
      scroll={{ y: "60vh", x: "100%" }}
    />
  );
}

export default TableLogo;
