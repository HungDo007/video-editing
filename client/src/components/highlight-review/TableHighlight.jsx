import React, { useRef, useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { IconButton, Tooltip } from "@mui/material";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space } from "antd";
import "../table-video.css";
import "antd/dist/antd.css";

function TableHighlight(props) {
  const {
    data,
    handleViewClick,
    handleIconDeleteClick,
    handleIconDownloadClick,
  } = props;

  // for search
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
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

  const columns = [
    {
      title: "Name",
      render: (row) => {
        return row.matchInfo?.substring(1, row.matchInfo?.indexOf(")"));
      },
    },
    {
      title: "Time merge",
      render: (row) => {
        return row.matchInfo?.substring(
          row.matchInfo?.indexOf(")") + 3,
          row.matchInfo?.indexOf(")") + 13
        );
      },
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },

    {
      render: (row) => {
        return (
          <Tooltip key={123} title="View">
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                console.log(row);
                handleViewClick(row);
              }}
            >
              <VideoLibraryIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      render: (row) => {
        return (
          <Tooltip key={123} title="Download">
            <IconButton onClick={() => handleIconDownloadClick(row)}>
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    // {
    //   render: (row) => {
    //     return (
    //       <Tooltip key={123} title="Share">
    //         <IconButton
    //           onClick={(e) => {
    //             console.log(row);
    //           }}
    //         >
    //           <ShareIcon />
    //         </IconButton>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      render: (row) => {
        return (
          <Tooltip key={123} title="Delete">
            <IconButton
              onClick={(e) => {
                console.log(row);
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
    return `Total: ${total} videos`;
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

export default TableHighlight;
