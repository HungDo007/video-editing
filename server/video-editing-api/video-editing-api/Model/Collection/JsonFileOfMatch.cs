using MongoDB.Bson.Serialization.Attributes;
using video_editing_api.Model.InputModel;

namespace video_editing_api.Model.Collection
{
    public class JsonFileOfMatch
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public InputSendServer JsonFile { get; set; }
    }
}
