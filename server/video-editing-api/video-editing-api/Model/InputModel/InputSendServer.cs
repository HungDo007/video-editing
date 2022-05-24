using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputSendServer
    {
        public List<Eventt> Event { get; set; }
        public string match_name { get; set; }
        public string league { get; set; }
        public List<string> teams { get; set; }
        public string match_date { get; set; }
        public string IP { get; set; }
        public List<int> score { get; set; }
        public string outfolder { get; set; }
        public string inforder { get; set; }
        public string mp4folder { get; set; }
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

    }
}
