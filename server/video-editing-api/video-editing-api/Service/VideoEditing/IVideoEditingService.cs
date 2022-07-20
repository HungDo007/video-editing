using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;

namespace video_editing_api.Service.VideoEditing
{
    public interface IVideoEditingService
    {
        Task<List<Tournament>> GetTournament();
        Task<string> AddTournament(List<Tournament> tournaments);

        Task<MatchInfo> GetInfoOfMatch(string id);
        Task<List<MatchInfo>> GetMatchInfo(string username);
        Task<string> AddMatchInfo(string username, MatchInfo matchInfo);
        Task<bool> DeleteMatch(string id);
        Task<string> ConcatVideoOfMatch(string username, ConcatModel concatModel);

        Task<List<string>> NotConcatVideoOfMatch(string username, ConcatModel concatModel);

        Task<bool> DeleteHighlight(string id);
        Task<List<HighlightVideo>> GetHighlightVideos();
        Task<List<HighlightVideo>> GetHighlightVideosForMatch(string matchId);
        Task<List<HighlightVideo>> GetHighlightVideosHL(string username);
        Task<string> UploadJson(string username, string matchId, IFormFile jsonfile);

        Task<string> DownloadOne(ConcatModel concatModel);


        Task<bool> UpdateLogTrimed(string matchId, EventStorage eventStorage);
        Task<bool> UpdateLogTrimedAll(string matchId, int selected);

        Task<List<Tag>> GetTag(string username);
        Task<List<Team>> GetTeam(string username, string leagueId);
        Task<List<EventStorage>> GetJsonFromTag(string username, HighlightFilterByTagRequest request);

        Task<string> MergeHL(string username, InputMergeHL input);

        Task<string> SaveToGallery(string username, GalleryInput input);
        Task<List<Gallery>> getGalley(string username, int Type);
        Task<bool> deleteGallery(string id);

        Task<string> getUriRedirect(VideoUploadModel model);
        Task HandleCode(string code, string state);
    }
}
