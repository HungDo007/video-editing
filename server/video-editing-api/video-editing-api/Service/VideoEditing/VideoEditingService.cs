using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Service.DBConnection;

namespace video_editing_api.Service.VideoEditing
{
    public class VideoEditingService : IVideoEditingService
    {
        private readonly IMongoCollection<Action> _actions;
        private readonly IMongoCollection<Tournament> _tournament;
        private readonly IMongoCollection<MatchInfo> _matchInfo;
        private readonly IMongoCollection<SaveFilePath> _saveFilePath;


        private readonly Cloudinary _cloudinary;

        public VideoEditingService(IDbClient dbClient, IConfiguration config)
        {
            _actions = dbClient.GetActionCollection();
            _tournament = dbClient.GetTournamentCollection();
            _matchInfo = dbClient.GetMatchInfoCollection();
            _saveFilePath = dbClient.GetSaveFilePathCollection();


            var account = new Account(
               config["Cloudinary:CloudName"],
               config["Cloudinary:ApiKey"],
               config["Cloudinary:ApiSecret"]
               );

            _cloudinary = new Cloudinary(account);
        }

        #region Action
        public async Task<List<Action>> GetActions()
        {
            try
            {
                return await _actions.Find(action => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddAction(List<Action> actions)
        {
            try
            {
                await _actions.InsertManyAsync(actions);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion


        #region Tournament
        public async Task<Tournament> GetTournament(string id)
        {
            try
            {
                return await _tournament.Find(tournament => tournament.Id == id).FirstOrDefaultAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<List<Tournament>> GetTournament()
        {
            try
            {
                return await _tournament.Find(tournament => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddTournament(List<Tournament> tournaments)
        {
            try
            {
                await _tournament.InsertManyAsync(tournaments);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion



        #region MatchInfo
        public async Task<MatchInfo> GetMatchInfo(string id)
        {
            try
            {
                var res = (from m in _matchInfo.AsQueryable()
                           join t in _tournament.AsQueryable() on m.TournamentId equals t.Id
                           where m.Id == id
                           select new MatchInfo
                           {
                               Id = m.Id,
                               TournamentId = m.TournamentId,
                               Channel = m.Channel,
                               Ip = m.Ip,
                               MactchTime = m.MactchTime,
                               MatchName = m.MatchName,
                               Port = m.Port,
                               TournametName = t.Name
                           }).FirstOrDefault();
                return res;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<List<MatchInfo>> GetMatchInfo()
        {
            try
            {
                var res = (from m in _matchInfo.AsQueryable()
                           join t in _tournament.AsQueryable() on m.TournamentId equals t.Id
                           select new MatchInfo
                           {
                               Id = m.Id,
                               TournamentId = m.TournamentId,
                               Channel = m.Channel,
                               Ip = m.Ip,
                               MactchTime = m.MactchTime,
                               MatchName = m.MatchName,
                               Port = m.Port,
                               TournametName = t.Name
                           }).ToList();

                return res;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddMatchInfo(MatchInfo matchInfo)
        {
            try
            {
                await _matchInfo.InsertOneAsync(matchInfo);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion


        public async Task<string> UploadVideo(string Id, IFormFile file)
        {

            try
            {
                var match = _matchInfo.Find(x => x.Id == Id).First();
                var tournament = _tournament.Find(x => x.Id == match.TournamentId).First();

                string tournamentName = tournament.Name;
                string matchName = match.MatchName;
                string matchTime = match.MactchTime.ToString("dd-MM-yyyy-HH-mm");

                match.Videos.Add(await UploadVideoForMatch(file, tournamentName, matchName, matchTime));

                _matchInfo.ReplaceOne(m => m.Id == Id, match);
                return "Succed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        private async Task<VideoResource> UploadVideoForMatch(IFormFile file, string tournamentName, string matchName, string matchTime)
        {
            try
            {
                await using var stream = file.OpenReadStream();
                var name = System.Guid.NewGuid();
                var param = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(720).Width(1280).Crop("fill"),
                    PublicId = $"VideoEditing/{tournamentName}/{matchName}-{matchTime}/{name}"
                };
                var uploadResult = await _cloudinary.UploadAsync(param);

                return new VideoResource()
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<string> ConcatVideoOfMatch(string matchId, TrimVideoHightlightModel model)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                return string.Empty;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
    }
}
