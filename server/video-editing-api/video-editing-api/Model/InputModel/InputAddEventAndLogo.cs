using Microsoft.AspNetCore.Http;

namespace video_editing_api.Model.InputModel
{
    public class InputAddEventAndLogo
    {
        public string eventName { get; set; }
        public IFormFile File { get; set; }
        public int position { get; set; }
    }
}
