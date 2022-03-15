using MongoDB.Driver;
using video_editing_api.Model;

namespace video_editing_api.Service.DBConnection
{
    public interface IDbClient
    {
        IMongoCollection<Action> GetActionCollection();
    }
}
