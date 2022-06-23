using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace video_editing_api.Model.Collection
{
    public class TagEvent
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Username { get; set; }
        public List<Tag> Tag { get; set; } = new List<Tag>();

    }


    public class Tag
    {
        public Tag(string tagName)
        {
            TagName = tagName;
        }

        public string TagName { get; set; }
    }
    public class Team
    {
        public Team(string teamName)
        {
            TeamName = teamName;
        }

        public string TeamName { get; set; }
    }
}
