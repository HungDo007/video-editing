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
        private readonly IMongoCollection<HighlightVideo> _highlight;


        private readonly Cloudinary _cloudinary;

        public VideoEditingService(IDbClient dbClient, IConfiguration config)
        {
            _actions = dbClient.GetActionCollection();
            _tournament = dbClient.GetTournamentCollection();
            _matchInfo = dbClient.GetMatchInfoCollection();
            _highlight = dbClient.GetHighlightVideoCollection();


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
                               TournametName = t.Name,
                               Videos = m.Videos,
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
                               TournametName = t.Name,
                               Videos = m.Videos,
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
                var videoresource = new VideoResource();
                await using var stream = file.OpenReadStream();
                var name = System.Guid.NewGuid();
                var param = new VideoUploadParams
                {                   
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(720).Width(1280).Crop("fill"),
                    PublicId = $"VideoEditing/{tournamentName}/{matchName}-{matchTime}/{name}"
                };
                var uploadResult = _cloudinary.Upload(param);

                if (uploadResult.Error == null)
                {
                    videoresource.PublicId = uploadResult.PublicId;
                    videoresource.Duration = uploadResult.Duration;
                    videoresource.Url = uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new System.Exception(uploadResult.Error.Message);
                }
                return videoresource;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        public async Task<List<HighlightVideo>> GetHighlightVideos()
        {
            try
            {
                return await _highlight.Find(highligth => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<string> ConcatVideoOfMatch(string matchId, List<TrimVideoHightlightModel> models)
        {
            try
            {
                string response = string.Empty;
                var match = _matchInfo.Find(x => x.Id == matchId).First();
                if (models.Count > 0)
                {
                    var trans = new Transformation().EndOffset(models[0].EndTime).StartOffset(models[0].StartTime);

                    for (int i = 1; i < models.Count; i++)
                    {
                        trans.Chain().Flags("splice").Overlay(new Layer().PublicId($"video:{models[i].PublicId}")).EndOffset(models[i].EndTime).StartOffset(models[i].StartTime).Chain();
                    }

                    var fitstVideo = match.Videos.Where(x => x.PublicId == models[0].PublicId).FirstOrDefault();
                    if (fitstVideo != null)
                    {
                        var name = System.Guid.NewGuid();
                        var param = new VideoUploadParams
                        {
                            File = new FileDescription(fitstVideo.Url),
                            Transformation = models.Count > 1 ? trans.Chain().Flags("layer_apply") : trans,
                            PublicId = $"VideoEditing/Highlight/{match.MatchName}-{match.MactchTime.ToString("dd-MM-yyyy-HH-mm")}/{name}"
                        };
                        var uploadResult = await _cloudinary.UploadAsync(param);
                        if (uploadResult.Error == null)
                        {
                            var highlight = new HighlightVideo()
                            {
                                MatchId = match.Id,
                                MatchInfo = $"({match.MatchName})T({match.MactchTime.ToString("dd-MM-yyyy-hh-mm")})",
                                Duration = uploadResult.Duration,
                                PublicId = uploadResult.PublicId,
                                Url = uploadResult.SecureUrl.ToString()
                            };
                            await _highlight.InsertOneAsync(highlight);
                            response = "Succeed";
                        }
                        else
                        {
                            throw new System.Exception(uploadResult.Error.Message);
                        }
                    }
                    else
                    {
                        throw new System.Exception("No video in storage video of match!");
                    }
                }
                else
                {
                    throw new System.Exception("No video to concat");
                }
                return response;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
    }
}
