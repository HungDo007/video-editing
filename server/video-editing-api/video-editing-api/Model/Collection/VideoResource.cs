using MongoDB.Bson.Serialization.Attributes;

namespace video_editing_api.Model.InputModel
{
    public class VideoResource
    {
        public string PublicId { get; set; }
        public double Duration { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
