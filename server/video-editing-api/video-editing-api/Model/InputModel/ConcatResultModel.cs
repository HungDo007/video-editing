﻿using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class ConcatResultModel
    {
        public string mp4 { get; set; }
        public string ts { get; set; }
    }

    public class NotConcatResultModel
    {
        public List<string> mp4 { get; set; }
        public List<string> ts { get; set; }
    }
}
