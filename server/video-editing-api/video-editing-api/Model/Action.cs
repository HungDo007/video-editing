using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model
{
    public class Action
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
