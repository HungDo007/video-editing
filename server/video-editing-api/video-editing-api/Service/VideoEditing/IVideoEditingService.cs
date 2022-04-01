using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;

namespace video_editing_api.Service.VideoEditing
{
    public interface IVideoEditingService
    {
        Task<List<Action>> GetActions();
        Task<string> AddAction(List<Action> actions);


        Task<Tournament> GetTournament(string id);
        Task<List<Tournament>> GetTournament();
        Task<string> AddTournament(List<Tournament> tournaments);


        Task<MatchInfo> GetMatchInfo(string id);
        Task<List<MatchInfo>> GetMatchInfo();
        Task<string> AddMatchInfo(MatchInfo matchInfo);


        Task<string> UploadVideo(string Id, IFormFile file);
        Task<string> ConcatVideoOfMatch();
        //string matchId, TrimVideoHightlightModel model
    }
}
