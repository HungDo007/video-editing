using System.Collections.Generic;
using video_editing_api.Model.InputModel;

namespace video_editing_api
{
    public static class BackgroundQueue
    {
        public static Queue<MergeQueueInput> MergeQueue { set; get; } = new Queue<MergeQueueInput>();
    }
}
