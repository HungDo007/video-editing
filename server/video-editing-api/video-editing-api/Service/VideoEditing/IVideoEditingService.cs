using System.Collections.Generic;
using video_editing_api.Model;

namespace video_editing_api.Service.VideoEditing
{
    public interface IVideoEditingService
    {
        List<Action> GetActions();
        bool AddAction(List<Action> actions);
    }
}
