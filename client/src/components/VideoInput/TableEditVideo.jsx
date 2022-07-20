import React, { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import "./table-video.css";
import "antd/dist/antd.css";
import { formatTimeSlice } from "./video-input";
import { Checkbox } from "@mui/material";

function TableEditVideo(props) {
  const { data, onTableClick, buttonReview, height, onCheckOne, onCheckAll } =
    props;
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const searchInput = useRef(null);
  const [select, setSelect] = useState(0);
  const [sumTrimTime, setSumTrimTime] = useState();

  const [filterLv, setFilterLv] = useState();
  const [filterEvent, setFilterEvent] = useState();

  useEffect(() => {
    const lvfilter = [...new Set(data.map((item) => item.level))];
    var a = [];
    lvfilter.forEach((item) => {
      return a.push({ text: item, value: item });
    });
    setFilterLv(a);

    const evfilter = [...new Set(data.map((item) => item.event))];
    var b = [];
    evfilter.forEach((item) => {
      return b.push({ text: item, value: item });
    });
    setFilterEvent(b);
  }, [data?.length]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearch([], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "unset" }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 120,
      render: (time) => time.substring(0, 2) + "m" + time.substring(2, 4) + "s",
    },
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      width: 150,
      //...getColumnSearchProps("event"),
      filters: filterEvent,
      onFilter: (event, record) => {
        return record.event === event;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 75,
      filters: filterLv,
      onFilter: (level, record) => {
        return record.level === level;
      },
    },
    {
      title: "Trim Length",
      dataIndex: "selected",
      key: "Trim Length",
      width: 100,
      render: (selected, row) => {
        if (selected === 1) return formatTimeSlice(row.endTime - row.startTime);
        else return "-";
      },
    },
    {
      title: () => {
        return (
          <Checkbox
            checked={
              data?.findIndex((d) => d.selected === 0 || d.selected === -1) ===
              -1
            }
            onChange={(e) => onCheckAll(e.target.checked)}
          />
        );
      },
      width: 100,
      render: (_, record) => {
        return (
          <Checkbox
            checked={record.selected === 1}
            onChange={(e) => onCheckOne(e.target.checked, record)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    const sum = data.reduce((accumulator, vd) => {
      let time = 0;
      if (vd.selected === 1) {
        time = vd.endTime - vd.startTime;
      }
      return accumulator + time;
    }, 0);
    setSumTrimTime(sum);
  }, [data]);

  function showTotal(total) {
    return `Total: ${total} videos`;
  }

  const onPageChange = (page, pageSize) => {
    setSelect(data[(page - 1) * pageSize].file_name);
    onTableClick(data[(page - 1) * pageSize]);
  };

  return (
    <Table
      rowClassName={(record, index) =>
        record.file_name === select ? "table-row-selected" : ""
      }
      bordered
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            setSelect(record.file_name);
            onTableClick(record);
          }, // click row
        };
      }}
      columns={columns}
      dataSource={data}
      pagination={{
        showTotal: showTotal,
        showSizeChanger: true,
        onChange: onPageChange,
      }}
      footer={() => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Total Trimmed: {formatTimeSlice(sumTrimTime)}
            {buttonReview}
          </div>
        );
      }}
      scroll={{ y: height, x: "100%" }}
    />
  );
}

export default TableEditVideo;
