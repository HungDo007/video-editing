using Microsoft.AspNetCore.Http;

namespace video_editing_api.Model.InputModel
{
    public class GalleryInput
    {
        public string EventName { get; set; }
        public IFormFile File { get; set; }
        public int Type { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
    }
}
