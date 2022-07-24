using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model.Collection
{
    public class Gallery
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Event { get; set; }
        public string file_name { get; set; }
        public int Type { get; set; }
        public int Width { get; set; } = 0;
        public int Height { get; set; } = 0;
    }
}
