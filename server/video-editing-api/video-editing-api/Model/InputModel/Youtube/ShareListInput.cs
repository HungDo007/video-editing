using Google.Apis.YouTube.v3.Data;

namespace video_editing_api.Model.InputModel.Youtube
{
    public class ShareListInput
    {
        public ShareListInput()
        {
        }

        public ShareListInput(OAuthUserCredential credential, string videoUrl, Video videoInfo)
        {
            Credential = credential;
            VideoUrl = videoUrl;
            VideoInfo = videoInfo;
        }

        public OAuthUserCredential Credential { get; set; }
        public string VideoUrl { get; set; }
        public Video VideoInfo { get; set; }
    }
}
