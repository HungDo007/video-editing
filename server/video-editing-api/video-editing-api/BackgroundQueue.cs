using System.Collections.Generic;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;

namespace video_editing_api
{
    public static class BackgroundQueue
    {
        public static Queue<MergeQueueInput> MergeQueue { set; get; } = new Queue<MergeQueueInput>();
        public static List<ShareListInput> ShareListInputs { set; get; } = new List<ShareListInput>();
    }
}
