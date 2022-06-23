using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace video_editing_api.Model.Collection
{
    public class TeamOfLeague
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string TournamentId { get; set; }

        public string Username { get; set; }
        public List<Team> Team { get; set; } = new List<Team>();
    }
}
