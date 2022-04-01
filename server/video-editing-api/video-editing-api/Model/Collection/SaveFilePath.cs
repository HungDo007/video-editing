using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model.Collection
{
    public class SaveFilePath
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string MatchId { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string VideoResourceId { get; set; }
    }
}
