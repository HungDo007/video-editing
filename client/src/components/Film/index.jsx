import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import FilmTable from "./film-table";

function Film() {
  const [categories, setCategories] = useState([]);
  const [hidden, setHidden] = useState(true);
  const [filmData, setFilmData] = useState({
    category: "",
    title: "",
    videoId: "",
  });

  const handleCategoryChange = (e, value) => {
    setCategories(value);
  };

  const handleSubmit = () => {
    console.log("submit");
  };

  return (
    <>
      <Card
        sx={{
          width: "60%",
          padding: 5,
          margin: "auto",
          marginBottom: 3,
          flexGrow: 1,
        }}
      >
        <Grid
          container
          spacing={2}
          component="form"
          alignItems="center"
          justifyContent="center"
          onSubmit={handleSubmit}
        >
          <Grid item xs={3}>
            Category
          </Grid>
          <Grid item xs={9}>
            <div hidden={!hidden}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton color="primary" onClick={() => setHidden(!hidden)}>
                  <AddIcon />
                </IconButton>
                <Autocomplete
                  options={categories ? categories : []}
                  size="small"
                  value={categories || null}
                  fullWidth
                  getOptionLabel={(option) => option["name"] || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Category"
                      variant="standard"
                      required={hidden}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>
            <div hidden={hidden}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton color="primary" onClick={() => setHidden(!hidden)}>
                  <ArrowLeftIcon />
                </IconButton>
                <TextField
                  value={filmData.category}
                  variant="standard"
                  size="small"
                  onChange={(e) =>
                    setFilmData({ ...filmData, category: e.target.value })
                  }
                  fullWidth
                  required={!hidden}
                  placeholder="Enter Category Name"
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={3}>
            Title
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={filmData.title}
              variant="standard"
              size="small"
              onChange={(e) =>
                setFilmData({ ...filmData, title: e.target.value })
              }
              fullWidth
              required
              placeholder="Enter title"
            />
          </Grid>

          <Grid item xs={3}>
            Video ID
          </Grid>
          <Grid item xs={9}>
            <TextField
              value={filmData.videoId}
              variant="standard"
              size="small"
              onChange={(e) =>
                setFilmData({ ...filmData, videoId: e.target.value })
              }
              fullWidth
              required
              placeholder="Enter Video ID"
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center", width: 650 }}
          >
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
      <FilmTable data={categories} />
    </>
  );
}

export default Film;
