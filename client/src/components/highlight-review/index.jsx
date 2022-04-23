import React, { useEffect, useState } from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import ReactPlayer from "react-player";

function HighlightReview() {
  const [highlights, setHighlights] = useState();
  const [source, setSource] = useState();
  const [name, setName] = useState();

  const [opendialog, setOpenDialog] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
  };
  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = React.useRef(null);

  useEffect(() => {
    const getHighlight = async () => {
      try {
        var response = await videoEditingApi.getHighlight();
        setHighlights(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    getHighlight();
  }, []);

  const handleViewClick = (e, url, name) => {
    setName(name);
    setOpenDialog(true);
    setSource(url);
  };

  return (
    <>
      <Dialog
        open={opendialog}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#333333",
            color: "#ffffff",
            fontSize: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          id="scroll-dialog-title"
        >
          <h5>Highlight {name}</h5>
          <Button className="float-right-cancel" onClick={handleClose}>
            <CancelOutlinedIcon className="color-button-cancel" />
          </Button>
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ReactPlayer
              ref={null}
              url={source}
              controls
              width="100%"
              height="auto"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#CEEBF9" }}>
            <TableCell
              key={0}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Num</b>
            </TableCell>
            <TableCell
              key={1}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Match</b>
            </TableCell>
            <TableCell
              key={2}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            >
              <b>Times</b>
            </TableCell>
            <TableCell
              key={3}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            />
            <TableCell
              key={4}
              sx={{
                border: "1px solid #76BBD9",
                padding: 1,
              }}
              align="center"
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {/* style={ {minHeight: '45px' } } */}
          {highlights?.map((highlight, i) => (
            <TableRow key={i}>
              <TableCell
                key={1}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {i + 1}
              </TableCell>
              <TableCell
                key={2}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {highlight.matchInfo?.substring(
                  1,
                  highlight.matchInfo.indexOf(")")
                )}
              </TableCell>
              <TableCell
                key={3}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                {highlight.matchInfo?.substring(
                  highlight.matchInfo.indexOf(")") + 3,
                  highlight.matchInfo.indexOf(")") + 13
                )}
              </TableCell>
              <TableCell
                key={7}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                <Tooltip title="View" placement="right">
                  <IconButton
                    onClick={(e) =>
                      handleViewClick(
                        e,
                        highlight.mp4,
                        highlight.matchInfo?.substring(
                          1,
                          highlight.matchInfo.indexOf(")")
                        )
                      )
                    }
                  >
                    <VideoLibraryIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell
                key={8}
                sx={{
                  border: "1px solid #76BBD9",
                  padding: 1,
                }}
                align="center"
              >
                <Tooltip title="Download" placement="right">
                  <IconButton href={highlight.ts} target="_blank">
                    <CloudDownloadIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {(highlights === undefined || highlights.length === 0) && (
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #76BBD9",
                }}
                align="center"
                colSpan={5}
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default HighlightReview;
