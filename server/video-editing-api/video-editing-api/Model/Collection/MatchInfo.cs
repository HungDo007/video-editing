using MongoDB.Bson.Serialization.Attributes;
using System;
using video_editing_api.Model.InputModel;

namespace video_editing_api.Model.Collection
{
    public class MatchInfo
    {

        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]

        public string TournamentId { get; set; }
        public string Username { get; set; }
        public string TournametName { get; set; }
        public string MatchName { get; set; }
        public DateTime MactchTime { get; set; }
        public string Channel { get; set; }
        public string Ip { get; set; }
        public string Port { get; set; }
        public bool IsUploadJsonFile { get; set; } = false;
        public InputSendServer<EventStorage> JsonFile { get; set; }

        //public List<VideoResource> Videos { get; set; } = new List<VideoResource>();
    }
}
