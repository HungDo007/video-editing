using Microsoft.AspNetCore.Http;

namespace video_editing_api.Model.InputModel.Youtube
{
    public class VideoUploadModel
    {
        public IFormFile Credential { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UrlVideo { get; set; }
        public string Tags { get; set; }
        public string Privacy { get; set; }
    }
}
