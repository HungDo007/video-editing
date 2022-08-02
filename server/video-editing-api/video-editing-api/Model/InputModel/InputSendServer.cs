using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputSendServer<T>
    {
        public List<T> Event { get; set; } = new List<T>();
        public string match_name { get; set; } = string.Empty;
        public string league { get; set; } = string.Empty;
        public List<string> teams { get; set; } = new List<string>();
        public string match_date { get; set; } = string.Empty;
        public string IP { get; set; } = string.Empty;
        public List<int> score { get; set; } = new List<int>();
        public string outfolder { get; set; } = "/data/{}/{}/highlights/";
        public string inforder { get; set; } = "/data/{}/{}/ts/";
        public string mp4folder { get; set; } = "/data/{}/{}/mp4/";
        public string aspect_ratio { get; set; } = string.Empty;
        public string resolution { get; set; } = string.Empty;
        public string bitrate { get; set; } = string.Empty;
        public List<Logo> logo { get; set; }
    }

    public class Eventt
    {
        public int level { get; set; }
        public string time { get; set; }
        public string Event { get; set; }
        public string file_name { get; set; }
        public string ts_source { get; set; }
        public List<string> players { get; set; }
        public List<int> ts { get; set; }
        public int mainpoint { get; set; }
        public int qualified { get; set; }
        public int logo { get; set; }
    }

    public class EventStorage
    {
        public int level { get; set; }
        public string time { get; set; }
        public string Event { get; set; }
        public string file_name { get; set; }
        public string ts_source { get; set; }
        public List<string> players { get; set; }
        public List<int> ts { get; set; }
        public int mainpoint { get; set; } = 0;
        public int startTime { get; set; } = 0;
        public int endTime { get; set; } = 0;
        public int selected { get; set; } = -1;
        public int logo { get; set; }
    }

    public class Logo
    {
        public Postion position { get; set; }
        public string file_name { get; set; }
        public List<int> size { get; set; }
    }

    public class Postion
    {
        public int x { get; set; }
        public int y { get; set; }
    }
}
