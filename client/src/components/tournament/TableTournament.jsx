import React, { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Space, DatePicker } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link, IconButton, Tooltip } from "@mui/material";
import "../VideoInput/table-video.css";
import "antd/dist/antd.css";

import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const { RangePicker } = DatePicker;
function TableTournament(props) {
  const {
    data,
    titleSearch,
    handleResultClick,
    handleIconUploadClick,
    handleIconDeleteClick,
  } = props;

  const [titleS, setTitleS] = useState();
  useEffect(() => {
    const temp = [...titleSearch];
    const lstTemp = [];
    temp.forEach((item) => {
      lstTemp.push({ text: item.name, value: item.id });
    });
    setTitleS(lstTemp);
  }, [titleSearch]);

  // for search
  const searchInput = useRef(null);
  const searchInputDate = useRef(null);
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();

  const [searchDate, setSearchDate] = useState();

  const handleSearchDate = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchDate(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

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
  // end for search
  const getColumnSearchDateProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <RangePicker
          ref={searchInputDate}
          value={selectedKeys[0]}
          onChange={(date) => setSelectedKeys(date ? [date] : [])}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchDate(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearchDate([], confirm, dataIndex);
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
      <CalendarOutlined style={{ color: filtered ? "#1890ff" : "unset" }} />
    ),
    onFilter: (value, record) => {
      var dateStart = new Date(value[0]._d);
      var dateEnd = new Date(value[1]._d);
      var date = new Date(record[dataIndex]);
      var isInRange =
        dateEnd.getTime() >= date.getTime() &&
        dateStart.getTime() <= date.getTime();
      return isInRange ? record[dataIndex] : "";
    },
    // onFilterDropdownVisibleChange: (visible) => {
    //   if (visible) {
    //     setTimeout(() => searchInputDate.current.select(), 100);
    //   }
    // },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ""}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "tournametName",
      filters: titleS,
      onFilter: (value, record) => {
        return record.tournamentId === value;
      },
    },
    {
      title: "Name",
      dataIndex: "matchName",
      ...getColumnSearchProps("matchName"),
    },
    {
      title: "Time",
      dataIndex: "mactchTime",
      render: (mactchTime) => {
        return mactchTime.substring(0, 10) + " " + mactchTime.substring(11, 16);
      },
      ...getColumnSearchDateProps("mactchTime"),
    },
    {
      title: "Channel",
      dataIndex: "channel",
      ...getColumnSearchProps("channel"),
    },
    {
      title: "IP:Port",
      dataIndex: "ip",
      render: (ip, row) => {
        return row.ip + ":" + row.port;
      },
    },
    {
      title: "Video",
      dataIndex: "isUploadJsonFile",
      render: (isUploadJsonFile, row) => {
        if (isUploadJsonFile)
          return (
            <Link
              component="button"
              href="#"
              underline="none"
              onClick={(e) => {
                handleResultClick(e, row);
              }}
            >
              Result
            </Link>
          );
        else
          return (
            <span>
              Don't have video <br />
              Upload json file first
            </span>
          );
      },
    },
    {
      title: "Upload",
      render: (row) => {
        return (
          <Tooltip
            key={12345}
            title="Change/Upload Json file for match"
            placement="top"
          >
            <IconButton
              onClick={() => {
                handleIconUploadClick(row);
              }}
            >
              <CloudUploadIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      title: "Delete",
      render: (row) => {
        return (
          <Tooltip key={123} title="Delete Match" placement="top">
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                handleIconDeleteClick(row);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];
  const showTotal = (total) => {
    return `Total: ${total} match`;
  };
  return (
    <Table
      bordered
      pagination={{ showTotal: showTotal, showSizeChanger: true }}
      columns={columns}
      dataSource={data}
    />
  );
}

export default TableTournament;
