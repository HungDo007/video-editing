using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Authentication;
using video_editing_api.Model;

namespace video_editing_api.Service.DBConnection
{
    public class DbClient : IDbClient
    {
        private readonly DbConfig _dbConfig;
        private readonly IMongoCollection<Action> _actions;
        public DbClient(IOptions<DbConfig> options)
        {
            try
            {
                _dbConfig = options.Value;
                string connectionString = _dbConfig.ConnectionString;
                MongoClientSettings settings = MongoClientSettings.FromUrl(
                   new MongoUrl(connectionString)
                 );
                settings.SslSettings =
                  new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                var database = mongoClient.GetDatabase("VideoEditing");
                _actions = database.GetCollection<Action>(SystemConstants.ActionColection);
            }
            catch(System.Exception e )
            {
                throw new System.Exception(e.Message);
            }
        }
        public IMongoCollection<Action> GetActionCollection() => _actions;
    }
}
