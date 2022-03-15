using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using video_editing_api.Model;
using video_editing_api.Service.DBConnection;

namespace video_editing_api.Service.VideoEditing
{
    public class VideoEditingService : IVideoEditingService
    {
        private readonly IMongoCollection<Action> _actions;
        public VideoEditingService(IDbClient dbClient)
        {
            _actions = dbClient.GetActionCollection();
        }

        public bool AddAction(List<Action> actions)
        {
            try
            {
                _actions.InsertMany(actions);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public List<Action> GetActions()
        {
            return _actions.Find(book => true).ToList();
        }
    }
}
