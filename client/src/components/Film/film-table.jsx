import { Table } from "antd";

const FilmTable = ({data}) => {
  const columns = [
    {
      title: "Num",
      //   dataIndex: "???",
      //   filters: titleS,
      //   onFilter: (value, record) => {
      //     return record.tournamentId === value;
      //   },
    },
    {
      title: "Category",
      //   dataIndex: "matchName",
      //   ...getColumnSearchProps("matchName"),
    },
    {
      title: "Title",
      //   dataIndex: "mactchTime",
      //   render: (mactchTime) => {
      //     return mactchTime.substring(0, 10) + " " + mactchTime.substring(11, 16);
      //   },
    },
    {
      title: "ID Video",
      //   dataIndex: "channel",
      //   ...getColumnSearchProps("channel"),
    },
    {
      title: "Total Context",
      //   dataIndex: "ip",
      //   render: (ip, row) => {
      //     return row.ip + ":" + row.port;
      //   },
    },
    {
      title: "Results",
      //   dataIndex: "isUploadJsonFile",
      //   render: (isUploadJsonFile, row) => {
      //     if (isUploadJsonFile)
      //       return (
      //         <Link
      //           component="button"
      //           href="#"
      //           underline="none"
      //           onClick={(e) => {
      //             console.log(row);
      //             handleResultClick(e, row);
      //           }}
      //         >
      //           Result
      //         </Link>
      //       );
      //     else
      //       return (
      //         <span>
      //           Don't have video <br />
      //           Upload json file first
      //         </span>
      //       );
      //   },
    },
    {
      title: "Upload",
    },
    {
      title: "Delete",
    },
  ];
  const showTotal = (total) => {
    return `Total: ${total}`;
  };
  return (
    <Table
      bordered
      pagination={{ showTotal: showTotal, showSizeChanger: true }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default FilmTable;
