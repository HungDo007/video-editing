using AutoMapper;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;
using video_editing_api.Service.DBConnection;


namespace video_editing_api.Service.VideoEditing
{
    public class VideoEditingService : IVideoEditingService
    {

        private readonly IMongoCollection<Tournament> _tournament;
        private readonly IMongoCollection<MatchInfo> _matchInfo;
        private readonly IMongoCollection<HighlightVideo> _highlight;
        private readonly IMongoCollection<TagEvent> _tagEvent;
        private readonly IMongoCollection<TeamOfLeague> _teamOfLeague;
        private readonly IMongoCollection<Gallery> _gallery;

        private readonly IHubContext<NotiHub> _hub;
        private readonly IMapper _mapper;
        private IHttpClientFactory _clientFactory;
        private readonly IConfiguration _config;

        private readonly string _pathClientSecret;
        public VideoEditingService(IDbClient dbClient, IConfiguration config,
            IWebHostEnvironment webHostEnvironment, IMapper mapper, IHttpClientFactory clientFactory, IHubContext<NotiHub> hub)
        {
            _tournament = dbClient.GetTournamentCollection();
            _matchInfo = dbClient.GetMatchInfoCollection();
            _highlight = dbClient.GetHighlightVideoCollection();
            _tagEvent = dbClient.GetTagEventCollection();
            _teamOfLeague = dbClient.GetTeamOfLeagueCollection();
            _gallery = dbClient.GetGalleryCollection();
            _clientFactory = clientFactory;
            _config = config;
            _hub = hub;
            _pathClientSecret = Path.Combine(webHostEnvironment.ContentRootPath, "Cert", "client_secret.json");

            _mapper = mapper;
        }

        public VideoEditingService()
        {
        }


        #region Tournament      
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
        public async Task<MatchInfo> GetInfoOfMatch(string id)
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
                               //IsUploadJsonFile=m.IsUploadJsonFile,
                               JsonFile = m.JsonFile,
                               //Videos = m.Videos,
                           }).FirstOrDefault();
                return res;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<List<MatchInfo>> GetMatchInfo(string username)
        {
            try
            {
                var res = (from m in _matchInfo.AsQueryable()
                           join t in _tournament.AsQueryable() on m.TournamentId equals t.Id
                           where m.Username == username
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
                               IsUploadJsonFile = m.IsUploadJsonFile,
                               //Videos = m.Videos,
                           }).ToList();

                return res.OrderByDescending(m => m.MactchTime).ToList();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddMatchInfo(string username, MatchInfo matchInfo)
        {
            try
            {
                matchInfo.Username = username;
                if (matchInfo.TournamentId != null)
                    await _matchInfo.InsertOneAsync(matchInfo);
                else
                {
                    var tournament = await _tournament.Find(tnm => tnm.Name == matchInfo.TournametName).FirstOrDefaultAsync();
                    if (tournament == null)
                    {
                        tournament = new Tournament() { Name = matchInfo.TournametName };
                        await _tournament.InsertOneAsync(tournament);
                    }
                    var idTournament = tournament.Id;
                    matchInfo.TournamentId = idTournament;
                    await _matchInfo.InsertOneAsync(matchInfo);
                }

                var jsonBody = new
                {
                    match_id = matchInfo.Id
                };

                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri("http://118.69.218.59:7007");
                var json = JsonConvert.SerializeObject(jsonBody);
                try
                {
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                    var response = await client.PostAsync("/savematch", httpContent);
                    if (response.IsSuccessStatusCode)
                        return "Succeed";
                    else
                        throw new System.Exception(response.Content.ReadAsStringAsync().Result);
                }
                catch (System.Exception ex)
                {
                    throw new System.Exception(ex.Message);
                }
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<bool> DeleteMatch(string id)
        {
            try
            {
                await _matchInfo.DeleteOneAsync(match => match.Id == id);
                return true;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion


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


        public async Task<string> ConcatVideoOfMatch(string username, ConcatModel concatModel)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == concatModel.MatchId).First();
                //var eventNotQualified = match.JsonFile.Event.Where(x => x.selected == 0).ToList();
                var inputSend = handlePreSendServer(concatModel.JsonFile);

                //if (inputSend.logo.Count == 0) inputSend.logo.Add(new List<string>());

                HighlightVideo hl = new HighlightVideo()
                {
                    MatchId = concatModel.MatchId,
                    Description = concatModel.Description,
                    MatchInfo = $"({match.MatchName})T({DateTime.Now.ToString("dd-MM-yyyy-hh-mm")})",
                    Status = SystemConstants.HighlightStatusProcessing
                };
                await _highlight.InsertOneAsync(hl);

                var mergeQueue = new MergeQueueInput(inputSend, hl.Id, username);
                BackgroundQueue.MergeQueue.Enqueue(mergeQueue);
                return "Succeed";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> UploadJson(string username, string matchId, IFormFile jsonfile)
        {
            try
            {
                string textJson = string.Empty;
                var flagTag = false;
                var flagTeam = false;
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                using (var reader = new StreamReader(jsonfile.OpenReadStream()))
                {
                    textJson = await reader.ReadToEndAsync();
                }
                InputSendServer<EventStorage> input = JsonConvert.DeserializeObject<InputSendServer<EventStorage>>(textJson);
                #region tagEvent
                var tagEvnt = await _tagEvent.Find(tag => tag.Username == username).FirstOrDefaultAsync();
                if (tagEvnt == null)
                {
                    flagTag = true;
                    tagEvnt = new TagEvent();
                    tagEvnt.Username = username;
                }
                for (var i = 0; i < input.Event.Count; i++)
                {
                    if (!tagEvnt.Tag.Any(t => t.TagName.ToLower() == input.Event[i].Event.ToLower()))
                    {
                        tagEvnt.Tag.Add(new Model.Collection.Tag(input.Event[i].Event));
                    }

                    if (input.Event[i].ts.Count > 0)
                    {
                        var temp = input.Event[i].mainpoint - input.Event[i].ts[0];
                        input.Event[i].startTime = temp > 0 ? temp : input.Event[i].ts[1];
                        input.Event[i].endTime = input.Event[i].ts[1] - input.Event[i].ts[0];
                        input.Event[i].selected = i == 0 ? 1 : -1;
                    }
                }
                #endregion
                #region team
                var team = await _teamOfLeague.Find(team => team.TournamentId == match.TournamentId && team.Username == username).FirstOrDefaultAsync();
                if (team == null)
                {
                    flagTeam = true;
                    team = new TeamOfLeague();
                    team.Username = username;
                    team.TournamentId = match.TournamentId;
                }
                foreach (var item in input.teams)
                {
                    if (!team.Team.Any(t => t.TeamName.ToLower() == item.ToLower()))
                    {
                        team.Team.Add(new Team(item));
                    }
                }
                if (flagTeam)
                {
                    _teamOfLeague.InsertOne(team);
                }
                else
                {
                    _teamOfLeague.ReplaceOne(tag => tag.Id == team.Id, team);
                }
                #endregion

                if (flagTag)
                {
                    _tagEvent.InsertOne(tagEvnt);
                }
                else
                {
                    _tagEvent.ReplaceOne(tag => tag.Username == username, tagEvnt);
                }

                match.IsUploadJsonFile = true;
                match.JsonFile = input;
                _matchInfo.ReplaceOne(m => m.Id == matchId, match);
                return "Succeed";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteHighlight(string id)
        {
            try
            {
                await _highlight.DeleteOneAsync(hl => hl.Id == id);
                return true;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<List<HighlightVideo>> GetHighlightVideosForMatch(string matchId)
        {
            try
            {
                return await _highlight.Find(hl => hl.MatchId == matchId).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<List<HighlightVideo>> GetHighlightVideosHL(string username)
        {
            try
            {
                return await _highlight.Find(hl => hl.Username == username).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }



        public async Task<List<string>> NotConcatVideoOfMatch(string username, ConcatModel concatModel)
        {
            try
            {
                var jsonFile = concatModel.JsonFile.Event.Where(x => x.selected != -1).ToList();
                concatModel.JsonFile.Event = jsonFile;

                var inputSend = handlePreSendServer(concatModel.JsonFile);

                HighlightVideo hl = new HighlightVideo()
                {
                    MatchId = concatModel.MatchId,
                    Description = concatModel.Description,
                    MatchInfo = $"(Not merge)T({DateTime.Now.ToString("dd-MM-yyyy-hh-mm")})",
                    Status = SystemConstants.HighlightStatusProcessing,
                    StatusMerge = 1
                };
                await _highlight.InsertOneAsync(hl);

                var mergeQueue = new MergeQueueInput(inputSend, hl.Id, username, 1);
                BackgroundQueue.MergeQueue.Enqueue(mergeQueue);

                //Thread thead = new Thread(async () =>
                //{
                //    Console.WriteLine("start thread");
                //    try
                //    {
                //        HttpClient client = new HttpClient();
                //        client.Timeout = TimeSpan.FromDays(1);
                //        client.BaseAddress = new System.Uri("http://118.69.218.59:7007");
                //        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                //        var response = await client.PostAsync("/highlight_nomerge", httpContent);
                //        var result = await response.Content.ReadAsStringAsync();

                //        var listRes = JsonConvert.DeserializeObject<NotConcatResultModel>(result);
                //        await _hub.Clients.Group(username).SendAsync("not_merge", "background_task", JsonConvert.SerializeObject(listRes.mp4));

                //    }
                //    catch (System.Exception ex)
                //    {
                //        Console.WriteLine(ex.Message);
                //    }
                //    Console.WriteLine("stop thread");
                //});
                //thead.IsBackground = true;
                //thead.Start();
                return null;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }



        #region Download File    

        public async Task<string> DownloadOne(string username, ConcatModel concatModel)
        {
            try
            {
                var inputSend = handlePreSendServer(concatModel.JsonFile);
                inputSend.merge = 1;
                var json = JsonConvert.SerializeObject(inputSend);
                json = json.Replace("E", "e");

                Thread thead = new Thread(async () =>
                {
                    Console.WriteLine("start thread download one");
                    try
                    {
                        HttpClient client = new HttpClient();
                        client.Timeout = TimeSpan.FromDays(1);
                        client.BaseAddress = new System.Uri(_config["BaseUrlMergeVideo"]);
                        var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                        var response = await client.PostAsync("/projects/merge", httpContent);
                        var result = await response.Content.ReadAsStringAsync();

                        ConcatResultModel model = JsonConvert.DeserializeObject<ConcatResultModel>(result);
                        await _hub.Clients.Group(username).SendAsync("download_one", "background_task", JsonConvert.SerializeObject(model.mp4));

                    }
                    catch (System.Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                    Console.WriteLine("stop thread download one");
                });
                thead.IsBackground = true;
                thead.Start();
                return null;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        private InputSendServer<Eventt> handlePreSendServer(InputSendServer<EventStorage> input)
        {
            try
            {
                List<Eventt> eventts = new List<Eventt>();

                var inputSend = new InputSendServer<Eventt>();
                foreach (var item in input.logo)
                {
                    item.position.x = (int)Math.Round((float)item.position.x * 2);
                    item.position.y = (int)Math.Round((float)item.position.y * 2);
                    item.size[0] = (int)Math.Round((float)item.size[0] * 2);
                    item.size[1] = (int)Math.Round((float)item.size[1] * 2);
                }

                inputSend = _mapper.Map<InputSendServer<Eventt>>(input);
                eventts = MapAndAddEvent(eventts, input.Event);
                inputSend.Event = eventts;
                //inputSend.logo = input.logo;
                return inputSend;

            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
        private List<Eventt> MapAndAddEvent(List<Eventt> eventSrc, List<EventStorage> eventAdd)
        {
            try
            {
                foreach (var item in eventAdd)
                {
                    Eventt eventt = new Eventt()
                    {
                        Event = item.Event.Split("_").First(),
                        level = item.level,
                        mainpoint = item.mainpoint,
                        file_name = item.file_name,
                        ts_source = item.ts_source,
                        players = item.players,
                        time = item.time,
                        ts = new List<int>(),
                        qualified = item.selected == 0 ? item.selected : 1,
                        logo = item.logo
                    };
                    if (item.ts != null && item.ts.Count > 0)
                    {
                        eventt.ts.Add((int)(item.ts[0] + item.startTime));
                        eventt.ts.Add((int)(item.ts[0] + item.endTime));
                    }
                    eventSrc.Add(eventt);
                }
                return eventSrc;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<bool> UpdateLogTrimedAll(string matchId, int selected)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                foreach (var item in match.JsonFile.Event)
                {
                    item.selected = selected;
                }
                await _matchInfo.ReplaceOneAsync(m => m.Id == matchId, match);
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
        public async Task<bool> UpdateLogTrimed(string matchId, EventStorage eventStorage)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                var ev = match.JsonFile.Event.FindIndex(e => e.file_name == eventStorage.file_name);
                if (ev == -1)
                    return false;

                match.JsonFile.Event[ev] = eventStorage;

                await _matchInfo.ReplaceOneAsync(m => m.Id == matchId, match);
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        #endregion

        #region tag
        public async Task<List<Model.Collection.Tag>> GetTag(string username)
        {
            try
            {
                var tagEvnt = await _tagEvent.Find(tag => tag.Username == username).FirstOrDefaultAsync();

                if (tagEvnt == null)
                {
                    List<Model.Collection.Tag> tag = new List<Model.Collection.Tag>();
                    var matchs = _matchInfo.Find(x => x.Username == username && x.IsUploadJsonFile).ToList();
                    foreach (var match in matchs)
                    {

                        foreach (var item in match.JsonFile.Event)
                        {
                            if (!tag.Any(t => t.TagName.ToLower() == item.Event.ToLower()))
                            {
                                tag.Add(new Model.Collection.Tag(item.Event));
                            }
                        }

                    }
                    tagEvnt = new TagEvent();
                    tagEvnt.Username = username;
                    tagEvnt.Tag = tag;
                    _tagEvent.InsertOne(tagEvnt);

                    return tag;
                }
                else
                    return tagEvnt.Tag;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<List<Team>> GetTeam(string username, string leagueId)
        {
            try
            {
                if (string.IsNullOrEmpty(leagueId)) return new List<Team>();

                var team = await _teamOfLeague.Find(team => team.TournamentId == leagueId && team.Username == username).FirstOrDefaultAsync();

                if (team == null)
                {
                    List<Team> teams = new List<Team>();
                    var matchs = _matchInfo.Find(x => x.Username == username && x.TournamentId == leagueId && x.IsUploadJsonFile).ToList();
                    foreach (var match in matchs)
                    {
                        foreach (var item in match.JsonFile.teams)
                        {
                            if (!teams.Any(t => t.TeamName.ToLower() == item.ToLower()))
                            {
                                teams.Add(new Team(item));
                            }
                        }

                    }

                    team = new TeamOfLeague();
                    team.Username = username;
                    team.TournamentId = leagueId;
                    team.Team = teams;
                    _teamOfLeague.InsertOne(team);

                    return teams;
                }
                else
                    return team.Team;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        public async Task<List<EventStorage>> GetJsonFromTag(string username, HighlightFilterByTagRequest request)
        {
            try
            {
                var matchs = await _matchInfo.Find(m => m.Username == username
                                                    && m.MactchTime >= request.DateFrom
                                                    && m.MactchTime <= request.DateTo
                                                    && m.IsUploadJsonFile
                                                    && m.TournamentId == request.TournamentId).ToListAsync();

                List<EventStorage> response = new List<EventStorage>();
                foreach (var match in matchs)
                {
                    if (CheckTeam(request.Teams, match.JsonFile.teams))
                    {
                        foreach (var item in match.JsonFile.Event)
                        {
                            if (item.Event == request.TagName)
                            {
                                EventStorage @event = item;
                                @event.Event += $"_{match.MatchName}";
                                @event.selected = -1;
                                response.Add(@event);
                            }
                        }
                    }
                }

                return response;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        private bool CheckTeam(List<Team> teamInput, List<string> teamCheck)
        {
            try
            {
                if (teamInput.Count < 1) return true;
                foreach (var item in teamCheck)
                {
                    if (teamInput.Any(x => x.TeamName == item))
                        return true;
                }
                return false;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
        #endregion

        public async Task<List<Gallery>> getGalley(string username, int Type)
        {
            try
            {
                if (Type != -1)
                {
                    return await _gallery.Find(gal => gal.Username == username && gal.Type == Type).ToListAsync();
                }
                else
                {
                    return await _gallery.Find(gal => gal.Username == username).ToListAsync();
                }
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }



        public async Task<string> SaveToGallery(string username, GalleryInput input)
        {
            try
            {
                Gallery gallery = new Gallery()
                {
                    Type = input.Type,
                    Event = input.EventName,
                    Username = username,
                    Height = input.Height,
                    Width = input.Width
                };
                gallery.file_name = await UploadToServerStorage(input.File);
                await _gallery.InsertOneAsync(gallery);
                return "success";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        private async Task<string> UploadToServerStorage(IFormFile file)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri("https://store.cads.live");

                var requestContent = new MultipartFormDataContent();

                if (file != null)
                {
                    byte[] data;
                    using (var br = new BinaryReader(file.OpenReadStream()))
                    {
                        data = br.ReadBytes((int)file.OpenReadStream().Length);
                    }
                    ByteArrayContent bytes = new ByteArrayContent(data);
                    requestContent.Add(bytes, "file", file.FileName);
                }
                var response = await client.PostAsync("/projects/", requestContent);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    dynamic jsons = JsonConvert.DeserializeObject(result);
                    return jsons.url;
                }
                else
                    throw new System.Exception(await response.Content.ReadAsStringAsync());
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> MergeHL(string username, InputMergeHL input)
        {
            try
            {
                InputSendServer<EventStorage> inputSendServer = new InputSendServer<EventStorage>();
                inputSendServer.Event = input.Event;
                //if (input.Logo.Count == 0) input.Logo.Add(new List<string>());
                inputSendServer.logo = input.Logo;


                var inputSend = handlePreSendServer(inputSendServer);


                HighlightVideo hl = new HighlightVideo()
                {
                    MatchId = null,
                    Description = input.Description,
                    Username = username,
                    MatchInfo = null,
                    Status = SystemConstants.HighlightStatusProcessing
                };
                await _highlight.InsertOneAsync(hl);

                var mergeQueue = new MergeQueueInput(inputSend, hl.Id, username);
                BackgroundQueue.MergeQueue.Enqueue(mergeQueue);
                return "Succeed";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<bool> deleteGallery(string id)
        {
            try
            {
                await _gallery.DeleteOneAsync(gal => gal.Id == id);
                return true;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        #region youtube
        public async Task<string> getUriRedirect(VideoUploadModel model)
        {
            try
            {
                const string OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
                OAuthUserCredential user = JsonConvert.DeserializeObject<OAuthUserCredential>(File.ReadAllText(_pathClientSecret));

                string id = Guid.NewGuid().ToString();
                var data = new Dictionary<string, string>
                {
                     { "client_id", user.client_id },
                     { "scope", YouTubeService.Scope.YoutubeUpload },
                     { "response_type", "code" },
                     { "redirect_uri", user.redirect_uris[0] },
                     { "access_type", "offline" },
                     {"state", id }
                };

                var newUrl = QueryHelpers.AddQueryString(OAUTH_URL, data);
                //video to share
                var video = new Video()
                {
                    Status = new VideoStatus
                    {
                        PrivacyStatus = model.Privacy,
                        SelfDeclaredMadeForKids = false,
                    },
                    Snippet = new VideoSnippet
                    {
                        CategoryId = "28",
                        Title = model.Title,
                        Description = model.Description,
                        Tags = string.IsNullOrEmpty(model.Tags) ? null : model.Tags.Split(" "),
                    }
                };

                var inputShare = new ShareListInput(id, model.UrlVideo, video);
                BackgroundQueue.ShareListInputs.Add(inputShare);
                return newUrl;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }

        }

        public async Task HandleCode(string code, string state)
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage();
                ShareListInput videoShare = BackgroundQueue.ShareListInputs.Where(x => x.Id == state).FirstOrDefault();
                if (videoShare == null)
                {
                    throw new Exception("No find video for share");
                }

                OAuthUserCredential user = JsonConvert.DeserializeObject<OAuthUserCredential>(File.ReadAllText(_pathClientSecret));
                var payload = new Dictionary<string, string>
                {
                    { "code" , code } ,
                    { "client_id" , user.client_id } ,
                    { "client_secret" , user.client_secret } ,
                    { "redirect_uri" , user.redirect_uris[0] } ,
                    { "grant_type" , "authorization_code" }
                };

                var content = new FormUrlEncodedContent(payload);
                var client = _clientFactory.CreateClient();
                response = await client.PostAsync(user.token_uri, content);
                response.EnsureSuccessStatusCode();

                var token = new Token();
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    token = JsonConvert.DeserializeObject<Token>(jsonString);
                }

                var video = videoShare.VideoInfo;

                var tokenResponse = await FetchToken(user, token);
                var youTubeService = FetchYouTubeService(tokenResponse, user.client_id, user.client_secret);
                Console.WriteLine("Lấy stream");
                var filePath = videoShare.VideoUrl; // Replace with path to actual movie file.
                WebClient Client = new WebClient();
                using (var fileStream = new MemoryStream(Client.DownloadData(filePath)))
                {
                    Console.WriteLine("Lấy stream done, fileSize: " + fileStream.Length);
                    var videosInsertRequest = youTubeService.Videos.Insert(video, "snippet,status", fileStream, "video/*");
                    videosInsertRequest.ProgressChanged += VideoUploadProgressChanged;
                    videosInsertRequest.ResponseReceived += VideoUploadResponseReceived;

                    //var chunkSize = 256 * 1024 * 4;
                    //videosInsertRequest.ChunkSize = chunkSize;
                    var progress = await videosInsertRequest.UploadAsync();
                    switch (progress.Status)
                    {
                        case UploadStatus.Completed:
                            Console.WriteLine("\n||==>UploadStatus.Conplete");
                            break;
                        case UploadStatus.Failed:
                            var error = progress.Exception;
                            Console.WriteLine("\n||==>UploadStatus.Failed->error.Message:{error.Message}", error.Message);
                            break;
                    }
                }

            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        void VideoUploadResponseReceived(Video video)
        {
            Console.WriteLine("n||==>Video was successfully uploaded.\n");
        }

        void VideoUploadProgressChanged(IUploadProgress progress)
        {
            switch (progress.Status)
            {
                case UploadStatus.Uploading:
                    var bytesSent = progress.BytesSent;
                    try
                    {
                        Console.WriteLine($"||==> Uploading video: {bytesSent} bytes sent.");
                    }
                    catch { }
                    break;
                case UploadStatus.Failed:
                    try
                    {
                        Console.WriteLine($"||==> An error prevented the upload from completing.{progress.Exception}");
                    }
                    catch { }
                    break;
            }

        }

        private async Task<TokenResponse> FetchToken(OAuthUserCredential user, Token token)
        {
            var isValid = await IsValid(token.access_token);
            if (!isValid)
            {
                token = await RefreshToken(user, token.refresh_token);
            }

            var tokenResponse = new TokenResponse
            {
                AccessToken = token.access_token,
                RefreshToken = token.refresh_token,
                Scope = token.scope,
                TokenType = token.token_type
            };

            return tokenResponse;
        }
        private async Task<Token> RefreshToken(OAuthUserCredential user, string refreshToken)
        {
            Token token = null;

            var payload = new Dictionary<string, string>
            {
              { "client_id" , user.client_id } ,
              { "client_secret" , user.client_secret } ,
              { "refresh_token" , refreshToken } ,
              { "grant_type" , "refresh_token" }
            };

            var content = new FormUrlEncodedContent(payload);

            var client = _clientFactory.CreateClient();
            var response = await client.PostAsync(user.token_uri, content);
            response.EnsureSuccessStatusCode();

            if (response.IsSuccessStatusCode)
            {
                var jsonResponse = await response.Content.ReadAsStringAsync();

                token = JsonConvert.DeserializeObject<Token>(jsonResponse);
                token.refresh_token = refreshToken;
            }
            return token;
        }
        private YouTubeService FetchYouTubeService(TokenResponse tokenResponse, string clientId, string clientSecret)
        {
            var initializer = new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = clientId,
                    ClientSecret = clientSecret
                }
            };

            var credentials = new UserCredential(new GoogleAuthorizationCodeFlow(initializer), "user", tokenResponse);
            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credentials,
                ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
            });

            return youtubeService;
        }

        private async Task<bool> IsValid(string accessToken)
        {
            const string TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";

            var url = $"{TOKEN_INFO_URL}{accessToken}";
            var response = await _clientFactory.CreateClient().GetAsync(url);
            var jsonString = await response.Content.ReadAsStringAsync();

            return !jsonString.Contains("error_description");
        }
        #endregion
    }
}
