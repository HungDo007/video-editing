using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Authentication;
using video_editing_api.Model;
using video_editing_api.Model.Collection;

namespace video_editing_api.Service.DBConnection
{
    public class DbClient : IDbClient
    {
        private readonly DbConfig _dbConfig;
        private readonly IMongoDatabase _database;
        public DbClient(IOptions<DbConfig> options)
        {
            try
            {
                _dbConfig = options.Value;

                MongoClientSettings settings = MongoClientSettings.FromUrl(
                   new MongoUrl(_dbConfig.ConnectionString)
                 );
                settings.SslSettings =
                  new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                _database = mongoClient.GetDatabase(_dbConfig.DbName);                
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public IMongoCollection<Action> GetActionCollection()
        {
            try
            {
                return _database.GetCollection<Action>(SystemConstants.ActionCollection);
            }
            catch(System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public IMongoCollection<MatchInfo> GetMatchInfoCollection()
        {
            try
            {
                return _database.GetCollection<MatchInfo>(SystemConstants.MatchInfoCollection);
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public IMongoCollection<HighlightVideo> GetHighlightVideoCollection()
        {
            try
            {
                return _database.GetCollection<HighlightVideo>(SystemConstants.HighlightVideoCollection);
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public IMongoCollection<Tournament> GetTournamentCollection()
        {
            try
            {
                return _database.GetCollection<Tournament>(SystemConstants.TournamentCollection);
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
    }
}
