import React, { useEffect, useState } from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Card,
  Button,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import ReactPlayer from "react-player";

function HighlightReview() {
  const [highlights, setHighlights] = useState();
  const [source, setSource] = useState();

  const [index, setIndex] = useState(-1);

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

  const handleClick = (highlight, i) => {
    setIndex(i);
    setSource(highlight.url);
  };

  return (
    <>
      <Card sx={{ padding: "10px", height: "82vh" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={3}
            style={{ maxHeight: "80vh", height: "100%", overflow: "auto" }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {highlights?.map((highlight, i) => (
                <Button
                  style={{ textTransform: "none" }}
                  onClick={() => handleClick(highlight, i)}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <VideoLibraryIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={highlight.matchInfo?.substring(
                        1,
                        highlight.matchInfo.indexOf(")")
                      )}
                      secondary={highlight.matchInfo?.substring(
                        highlight.matchInfo.indexOf(")") + 3,
                        highlight.matchInfo.indexOf(")") + 13
                      )}
                    />
                  </ListItem>
                </Button>
              ))}
            </List>
          </Grid>
          <Grid xs={9} item height="100%">
            <Card>
              <ReactPlayer
                ref={null}
                url={source}
                controls
                width="100%"
                height="480px"
              />
            </Card>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default HighlightReview;
