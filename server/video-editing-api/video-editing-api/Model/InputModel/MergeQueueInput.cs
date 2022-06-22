namespace video_editing_api.Model.InputModel
{
    public class MergeQueueInput
    {
        public MergeQueueInput()
        {
        }

        public MergeQueueInput(InputSendServer<Eventt> jsonFile, string idHiglight)
        {
            JsonFile = jsonFile;
            IdHiglight = idHiglight;
        }

        public InputSendServer<Eventt> JsonFile { get; set; }
        public string IdHiglight { get; set; }
    }
}
