using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputMergeHL
    {
        public string Description { get; set; }
        public List<EventStorage> Event { get; set; }
        public List<Logo> Logo { get; set; }
        public string aspect_ratio { get; set; }
        public string resolution { get; set; }
        public string bitrate { get; set; }
    }
}
