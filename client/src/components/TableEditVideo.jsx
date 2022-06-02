import React, { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import "./table-video.css";
import "antd/dist/antd.css";
import { formatTimeSlice } from "./video-input";

function TableEditVideo(props) {
  const { data, onTableClick, buttonReview } = props;
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const searchInput = useRef(null);
  const [select, setSelect] = useState(0);
  const [sumTrimTime, setSumTrimTime] = useState();

  const [filterLv, setFilterLv] = useState();

  useEffect(() => {
    const lvfilter = [...new Set(data.map((item) => item.level))];
    var a = [];
    lvfilter.forEach((item) => {
      return a.push({ text: item, value: item });
    });
    setFilterLv(a);
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
      setSelect(-1);
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
      ...getColumnSearchProps("event"),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 75,
      filters: filterLv,
      onFilter: (level, record) => {
        setSelect(-1);
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
      title: "Status",
      dataIndex: "selected",
      key: "Trim Length",
      width: 100,
      render: (selected, row) => {
        if (selected === 1) return "Trimmed";
        else if (selected === 0) return "Not qualified";
        else return "-";
      },
      filters: [
        {
          text: "-",
          value: -1,
        },
        {
          text: "Trimmed",
          value: 1,
        },
        {
          text: "Not qualified",
          value: 0,
        },
      ],
      onFilter: (value, record) => {
        setSelect(-1);
        return record.selected === value;
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
    onTableClick(data[(page - 1) * pageSize + select]);
  };

  return (
    <Table
      rowClassName={(record, index) =>
        index === select ? "table-row-selected" : ""
      }
      bordered
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            setSelect(rowIndex);
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
      scroll={{ y: "50vh", x: "100%" }}
    />
  );
}

export default TableEditVideo;
