import React, { useRef, useState } from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { IconButton, Tooltip } from "@mui/material";
import { SearchOutlined } from "@ant-design/icons";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Tag } from "antd";
import "../VideoInput/table-video.css";
import "antd/dist/antd.css";
import { FormShareYoutube } from "../flugin";

function TableHighlight(props) {
  const { data, handleViewClick, handleIconDeleteClick, downloadNoMerge } =
    props;

  // for search
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  //for share
  const [open, setOpen] = useState(false);
  const [urlShare, setUrlShare] = useState();

  const handleClose = () => {
    setOpen(false);
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
      title: "Status",
      render: (row) => {
        if (row.status === 0) {
          return (
            <Tag icon={<SyncOutlined spin />} color="processing">
              Processing
            </Tag>
          );
        } else if (row.status === 1) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Success
            </Tag>
          );
        } else if (row.status === 2) {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              error
            </Tag>
          );
        }
      },
    },
    {
      render: (row) => {
        return (
          <Tooltip key={123} title="View">
            <IconButton
              onClick={(e) => {
                handleViewClick(row);
              }}
              disabled={
                row.status === 1 && row.statusMerge === 0 ? false : true
              }
            >
              <VideoLibraryIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      render: (row) => {
        const temp = { ...row };
        console.log(row.statusMerge === 0);
        return row.statusMerge === 0 ? (
          <Tooltip key={123} title="Download">
            <IconButton
              href={temp.mp4?.replace("raw", "download")}
              target="_blank"
              disabled={row.status === 1 ? false : true}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip key={12332} title="Download">
            <IconButton
              onClick={() => downloadNoMerge(row.list_mp4)}
              disabled={row.status === 1 ? false : true}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    // {
    //   render: (row) => {
    //     return (
    //       <Tooltip key={123565} title="Share">
    //         <FacebookShareButton
    //           url={row.mp4}
    //           disabled={row.status === 1 ? false : true}
    //         >
    //           <FacebookIcon />
    //         </FacebookShareButton>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      render: (row) => {
        return (
          <Tooltip key={1235695} title="Share">
            <IconButton
              onClick={(e) => {
                setUrlShare(row.mp4);
                setOpen(true);
              }}
              disabled={row.status === 1 ? false : true}
            >
              <YouTubeIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      render: (row) => {
        return (
          <Tooltip key={123} title="Delete">
            <IconButton
              onClick={(e) => {
                handleIconDeleteClick(row);
              }}
              disabled={row.status !== 0 ? false : true}
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
    <>
      <FormShareYoutube
        open={open}
        handleClose={handleClose}
        videoUrl={urlShare}
      />
      <Table
        bordered
        pagination={{ showTotal: showTotal, showSizeChanger: true }}
        columns={columns}
        dataSource={data}
      />
    </>
  );
}

export default TableHighlight;
