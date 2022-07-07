using Microsoft.AspNetCore.Http;

namespace video_editing_api.Model.InputModel
{
    public class ShareModel
    {
        public IFormFile Cercredentials { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Tag { get; set; }
    }
}
