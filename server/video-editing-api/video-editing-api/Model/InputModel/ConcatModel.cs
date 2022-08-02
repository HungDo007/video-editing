namespace video_editing_api.Model.InputModel
{
    public class ConcatModel
    {
        public string MatchId { get; set; }
        public string Description { get; set; }
        public InputSendServer<EventStorage> JsonFile { get; set; }
        public string aspect_ratio { get; set; }
        public string resolution { get; set; }
        public string bitrate { get; set; }
    }
}
