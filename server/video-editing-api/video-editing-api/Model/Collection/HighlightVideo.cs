﻿using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace video_editing_api.Model.Collection
{
    public class HighlightVideo
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [JsonProperty("id")]
        public string Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        [JsonProperty("matchId")]
        public string MatchId { get; set; }
        [JsonProperty("matchInfo")]
        public string MatchInfo { get; set; }
        [JsonProperty("username")]
        public string Username { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonProperty("mp4")]
        public string mp4 { get; set; }
        [JsonProperty("ts")]
        public string ts { get; set; }
        [JsonProperty("status")]
        public int Status { get; set; }
        [JsonProperty("statusMerge")]
        public int StatusMerge { get; set; } = 0;
        public List<string> list_mp4 { get; set; }
        public List<string> list_ts { get; set; }
    }
}
