namespace video_editing_api.Model.InputModel
{
    public class MergeQueueInput
    {
        public MergeQueueInput()
        {
        }

        public MergeQueueInput(InputSendServer<Eventt> jsonFile, string idHiglight, string username)
        {
            JsonFile = jsonFile;
            IdHiglight = idHiglight;
            Username = username;
        }

        public InputSendServer<Eventt> JsonFile { get; set; }
        public string IdHiglight { get; set; }
        public string Username { get; set; }
    }
}
