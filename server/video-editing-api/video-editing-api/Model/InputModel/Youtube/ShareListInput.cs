using Google.Apis.YouTube.v3.Data;

namespace video_editing_api.Model.InputModel.Youtube
{
    public class ShareListInput
    {
        public ShareListInput()
        {
        }

        public ShareListInput(string id, string videoUrl, Video videoInfo)
        {
            Id = id;
            VideoUrl = videoUrl;
            VideoInfo = videoInfo;
        }

        public string Id { get; set; }
        public string VideoUrl { get; set; }
        public Video VideoInfo { get; set; }
    }
}
