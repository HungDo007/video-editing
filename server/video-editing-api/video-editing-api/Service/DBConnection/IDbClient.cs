using MongoDB.Driver;
using video_editing_api.Model;
using video_editing_api.Model.Collection;

namespace video_editing_api.Service.DBConnection
{
    public interface IDbClient
    {
        IMongoCollection<Action> GetActionCollection();
        IMongoCollection<Tournament> GetTournamentCollection();
        IMongoCollection<MatchInfo> GetMatchInfoCollection();
        IMongoCollection<HighlightVideo> GetHighlightVideoCollection();
        IMongoCollection<video_editing_api.Model.Collection.Film> GetFilmCollection();
        IMongoCollection<TagEvent> GetTagEventCollection();
    }
}
