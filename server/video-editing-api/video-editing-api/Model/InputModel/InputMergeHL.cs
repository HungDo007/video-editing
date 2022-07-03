using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputMergeHL
    {
        public string Description { get; set; }
        public List<EventStorage> Event { get; set; }
        public List<Logo> Logo { get; set; }
    }
}
