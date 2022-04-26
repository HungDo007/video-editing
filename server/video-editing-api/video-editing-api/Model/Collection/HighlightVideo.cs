using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model.Collection
{
    public class HighlightVideo
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string MatchId { get; set; }
        public string MatchInfo { get; set; }
        public string Description { get; set; }
        //public double Duration { get; set; }
        //public string PublicId { get; set; }
        public string mp4 { get; set; }
        public string ts { get; set; }
    }
}
