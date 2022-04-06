using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class TrimVideoHightlightModel
    {
        public string PublicId { get; set; }
        public int StartTime { get; set; }
        public int EndTime { get; set; }
    } 
}
