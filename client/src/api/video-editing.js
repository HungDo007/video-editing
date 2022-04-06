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
    console.log(data);
    return axiosClient.post(url, data);
  },
};

export default videoEditingApi;
