using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputSendServer<T>
    {
        public List<T> Event { get; set; }
        public string match_name { get; set; }
        public string league { get; set; }
        public List<string> teams { get; set; }
        public string match_date { get; set; }
        public string IP { get; set; }
        public List<int> score { get; set; }
        public string outfolder { get; set; }
        public string inforder { get; set; }
        public string mp4folder { get; set; }
        public List<List<string>> logo { get; set; }
    }

    public class Eventt
    {
        public int level { get; set; }
        public string time { get; set; }
        public string Event { get; set; }
        public string file_name { get; set; }
        public List<string> players { get; set; }
        public List<int> ts { get; set; }
        public int mainpoint { get; set; }
        public int qualified { get; set; }
    }

    public class EventStorage
    {
        public int level { get; set; }
        public string time { get; set; }
        public string Event { get; set; }
        public string file_name { get; set; }
        public List<string> players { get; set; }
        public List<int> ts { get; set; }
        public int mainpoint { get; set; } = 0;
        public int startTime { get; set; } = 0;
        public int endTime { get; set; } = 0;
        public int selected { get; set; } = -1;
    }
}
