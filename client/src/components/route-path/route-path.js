import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import ActionsManagement from "../new-action-labeling/actions-management/actions-management";
import ActionsLabeling from "../new-action-labeling/actions-labeling/actions-labeling";
import ModelManagement from "../model-management/model-management";
import ModelConfiguration from "../model-management/model-configuration/model-configuration";
import VideoManagement from "../video-analytics/videos-management/videos-management";
import Tournament from "../tournament/tournament";
import VideoInput from "../video-input";
import HighlightReview from "../highlight-review";
import Film from "../Film";

function RoutePath() {
  return (
    <Routes>
      <Route path="/" element={<Tournament />} />
      <Route path="/actions-labeling" element={<ActionsLabeling />} />
      <Route path="/model" element={<ModelManagement />} />
      <Route path="/model/configuration" element={<ModelConfiguration />} />
      <Route path="/video" element={<VideoManagement />} />
      <Route path="/tournament" element={<Tournament />} />
      <Route path="/film" element={<Film />} />
      <Route path="/video-edit" element={<VideoInput />} />
      <Route path="/highlight-review" element={<HighlightReview />} />
    </Routes>
  );
}

export default RoutePath;

// import React from "react";

// const RoutePath = () => (

// );

// export default RoutePath;
