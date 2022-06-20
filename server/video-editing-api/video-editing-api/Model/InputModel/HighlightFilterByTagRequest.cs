using System;

namespace video_editing_api.Model.InputModel
{
    public class HighlightFilterByTagRequest
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string TagName { get; set; }
    }
}
