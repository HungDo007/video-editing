import axiosClient from "./axios.client";

const videoEditingApi = {
  getMatches: () => {
    const url = "/VideoEditings/getMatch";
    return axiosClient.get(url);
  },

  getMatchById: (params) => {
    const url = "/VideoEditings/getMatchById/";
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

  concatHighlight: (matchId, data) => {
    const url = `/VideoEditings/concatHighlight/${matchId}`;
    return axiosClient.post(url, data);
  },

  getHighlight: () => {
    const url = "/VideoEditings/getHighligth";
    return axiosClient.get(url);
  },
};

export default videoEditingApi;
