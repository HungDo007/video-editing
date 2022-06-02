import axiosClient from "./axios.client";
import Axios from "axios";

const videoEditingApi = {
  getMatches: () => {
    const url = "/VideoEditings/getMatch";
    return axiosClient.get(url);
  },

  getMatchById: (params) => {
    const url = "/VideoEditings/getMatchById";
    return axiosClient.get(url, { params });
  },

  getTournaments: () => {
    const url = "/VideoEditings/getTournament";
    return axiosClient.get(url);
  },

  addMatch: (data) => {
    const url = "/VideoEditings/addMatch";
    return axiosClient.post(url, data);
  },

  concatHighlight: (matchId, hlDescription, data) => {
    const url = `/VideoEditings/concatHighlight`;
    const body = {
      matchId: matchId,
      description: hlDescription,
      jsonFile: data,
    };
    return axiosClient.post(url, body);
  },

  notConcatHighlight: (matchId, hlDescription, data) => {
    const url = `/VideoEditings/notConcatHighlight`;
    const body = {
      matchId: matchId,
      description: hlDescription,
      jsonFile: data,
    };
    return axiosClient.post(url, body);
  },

  getHighlight: () => {
    const url = "/VideoEditings/getHighlight";
    return axiosClient.get(url);
  },

  getHighlightOfMatch: (matchId) => {
    const url = `/VideoEditings/getHighlightOfMatch/${matchId}`;
    return axiosClient.get(url);
  },

  deleteHighlight: (id) => {
    const url = `/VideoEditings/deleteHighlight/${id}`;
    return axiosClient.delete(url);
  },
  deleteMatch: (id) => {
    const url = `/VideoEditings/deleteMatch/${id}`;
    return axiosClient.delete(url);
  },

  uploadJsonFile: (id, formdata) => {
    const url = `/VideoEditings/uploadJson/${id}`;
    return axiosClient.post(url, formdata);
  },
};

export default videoEditingApi;
