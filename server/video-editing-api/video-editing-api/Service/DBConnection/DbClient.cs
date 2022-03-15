using Microsoft.Extensions.Options;
using MongoDB.Driver;
using video_editing_api.Model;

namespace video_editing_api.Service.DBConnection
{
    public class DbClient : IDbClient
    {
        private readonly IMongoCollection<Action> _actions;
        private readonly string _dbName = "VideoEditing";
        private readonly string _actionCollection = "Action";
        public DbClient(IOptions<DbConfig> options)
        {
            var client = new MongoClient(options.Value.Connection_String);
            var database = client.GetDatabase(_dbName);
            _actions = database.GetCollection<Action>(_actionCollection);
        }
        public IMongoCollection<Action> GetActionCollection() => _actions;
    }
}
