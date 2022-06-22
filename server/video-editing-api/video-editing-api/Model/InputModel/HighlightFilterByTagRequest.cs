using System;
using System.Collections.Generic;
using video_editing_api.Model.Collection;

namespace video_editing_api.Model.InputModel
{
    public class HighlightFilterByTagRequest
    {
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string TagName { get; set; }
        public string TournamentId { get; set; }
        public List<Team> Teams { get; set; }
    }
}
