using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model.Collection
{
    public class Tournament
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
