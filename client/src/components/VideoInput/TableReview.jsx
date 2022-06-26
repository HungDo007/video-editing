import React, { useCallback, useRef } from "react";
import "antd/dist/antd.css";
import { Table } from "antd";
import update from "immutability-helper";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircleOutline";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { formatTimeSlice } from "./video-input";
import { IconButton, Tooltip } from "@mui/material";
const type = "DraggableBodyRow";

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};

      if (dragIndex === index) {
        return {};
      }

      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{
        cursor: "move",
        ...style,
      }}
      {...restProps}
    />
  );
};

function TableReview(props) {
  const { data, setData, handleIconRemoveClick } = props;

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      render: (time) =>
        time ? time.substring(0, 2) + "m" + time.substring(2, 4) + "s" : "-",
    },
    {
      title: "Event",
      dataIndex: "event",
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (level) => (level ? level : "-"),
    },
    {
      title: "Trim Length",
      render: (selected, row) => {
        return row.endTime ? formatTimeSlice(row.endTime - row.startTime) : "-";
      },
    },
    {
      title: "Remove",
      width: 100,
      render: (row) => {
        return (
          <Tooltip key={123} title="Remove event" placement="top">
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                handleIconRemoveClick(row);
              }}
            >
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [data]
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        bordered
        pagination={false}
        scroll={{ y: "60vh", x: "100%" }}
        onRow={(_, index) => {
          const attr = {
            index,
            moveRow,
          };
          return attr;
        }}
      />
    </DndProvider>
  );
}

export default TableReview;
