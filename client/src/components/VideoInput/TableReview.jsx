import React, { useCallback, useRef, useState } from "react";
import "antd/dist/antd.css";
import { Button, Checkbox, Table } from "antd";
import update from "immutability-helper";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircleOutline";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { formatTimeSlice } from "./video-input";
import { Autocomplete, IconButton, TextField, Tooltip } from "@mui/material";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
const type = "DraggableBodyRow";

const aspectRatioOptions = [
  { value: "4:3" },
  { value: "5:3" },
  { value: "3:2" },
  { value: "16:10" },
  { value: "16:9" },
  { value: "2:1" },
];
const resolutionRatioOptions = [
  { value: "320:240" },
  { value: "512:384" },
  { value: "720:480" },
  { value: "1280:720" },
  { value: "1920:1080" },
];

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
  const {
    data,
    setData,
    handleIconRemoveClick,
    logo,
    onCheck,
    logoCheckAll,
    aspectRatio,
    resolution,
    bitrate,
    setAspectRatio,
    setResolution,
    setBitrate,
  } = props;

  const [select, setSelect] = useState(0);
  const columns = [
    {
      width: 100,
      render: (selected, row, index) => {
        return (
          <>
            <div>
              <Button
                icon={<VerticalAlignTopOutlined />}
                size="small"
                style={{ width: 30 }}
                onClick={() => moveRow(index, 0)}
                disabled={index === 0 ? true : false}
              />
              <Button
                icon={<CaretUpOutlined />}
                size="small"
                style={{ width: 30 }}
                onClick={() => moveRow(index, index - 1)}
                disabled={index === 0 ? true : false}
              />
            </div>
            <div>
              <Button
                icon={<VerticalAlignBottomOutlined />}
                size="small"
                style={{ width: 30 }}
                onClick={() => moveRow(index, data?.length - 1)}
                disabled={index + 1 === data?.length ? true : false}
              />
              <Button
                icon={<CaretDownOutlined />}
                size="small"
                style={{ width: 30 }}
                onClick={() => moveRow(index, index + 1)}
                disabled={index + 1 === data?.length ? true : false}
              />
            </div>
          </>
        );
      },
    },
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
      width: 120,
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
      title: () => {
        return (
          <>
            <Checkbox
              checked={data?.findIndex((d) => d.logo === 0) === -1}
              onChange={(e) => logoCheckAll(e)}
            >
              Logo
            </Checkbox>
          </>
        );
      },
      width: 120,
      render: (_, record) => {
        return (
          <Checkbox
            checked={record.logo === 1}
            onChange={(e) => onCheck(record, e)}
          />
        );
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
      setSelect(data[dragIndex].file_name);
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

  const renderFooter = () => {
    var count = logo?.filter((lg) => lg.selected).length;
    return (
      <>
        {count} logo selected
        <Autocomplete
          options={aspectRatioOptions}
          size="small"
          value={aspectRatio || null}
          //fullWidth
          getOptionLabel={(option) => option["value"] || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Aspect ratio"
              variant="standard"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
          onChange={(e, value) =>
            value ? setAspectRatio(value) : setAspectRatio({ value: "4:3" })
          }
        />
        <Autocomplete
          options={resolutionRatioOptions}
          size="small"
          value={resolution || null}
          //fullWidth
          getOptionLabel={(option) => option["value"] || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Resolution"
              variant="standard"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
          onChange={(e, value) =>
            value ? setResolution(value) : setResolution({ value: "1920:1080" })
          }
        />
        <TextField
          value={bitrate}
          label="Bitrate (kbps)"
          variant="standard"
          size="small"
          type="number"
          onChange={(e) => setBitrate(e.target.value)}
          fullWidth
        />
      </>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        bordered
        rowClassName={(record, index) =>
          record.file_name === select ? "table-row-selected" : ""
        }
        pagination={false}
        scroll={{ y: "50vh", x: "100%" }}
        onRow={(record, index) => {
          const attr = {
            index,
            moveRow,
            onClick: (event) => {
              setSelect(record.file_name);
            },
          };
          return attr;
        }}
        footer={renderFooter}
      />
    </DndProvider>
  );
}

export default TableReview;
