using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Service.DBConnection;
using video_editing_api.Service.Storage;
using Xabe.FFmpeg;


namespace video_editing_api.Service.VideoEditing
{
    public class VideoEditingService : IVideoEditingService
    {

        private readonly IMongoCollection<Tournament> _tournament;
        private readonly IMongoCollection<MatchInfo> _matchInfo;
        private readonly IMongoCollection<HighlightVideo> _highlight;
        private readonly IMongoCollection<TagEvent> _tagEvent;
        private readonly IMongoCollection<TeamOfLeague> _teamOfLeague;

        private readonly IStorageService _storageService;
        private readonly Cloudinary _cloudinary;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;


        private string _dir;
        public VideoEditingService(IDbClient dbClient, IConfiguration config,
            IStorageService storageService, IWebHostEnvironment env, IMapper mapper)
        {
            _tournament = dbClient.GetTournamentCollection();
            _matchInfo = dbClient.GetMatchInfoCollection();
            _highlight = dbClient.GetHighlightVideoCollection();
            _tagEvent = dbClient.GetTagEventCollection();
            _teamOfLeague = dbClient.GetTeamOfLeagueCollection();

            _dir = env.WebRootPath;
            _storageService = storageService;
            _mapper = mapper;
            _env = env;
            var account = new Account(
               config["Cloudinary:CloudName"],
               config["Cloudinary:ApiKey"],
               config["Cloudinary:ApiSecret"]
               );

            _cloudinary = new Cloudinary(account);
        }


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




        public async Task<string> UploadVideoForMatch(string Id, IFormFile file)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == Id).First();
                var tournament = _tournament.Find(x => x.Id == match.TournamentId).First();

                string folderName = $"{tournament.Name}_{match.MatchName}_{match.MactchTime.ToString("dd-MM-yyyy-HH-mm")}";
                string publicId = System.Guid.NewGuid().ToString();
                string fileName = file.FileName;
                string type = fileName.Substring(fileName.LastIndexOf("."));

                string path = await _storageService.SaveFile(folderName, $"{publicId}{type}", file);
                VideoResource vr = new VideoResource()
                {
                    PublicId = publicId,
                    Name = fileName.Substring(0, fileName.LastIndexOf(".")),
                    Url = path,
                    Duration = await getDuration(path)
                };
                //match.Videos.Add(vr);
                _matchInfo.ReplaceOne(m => m.Id == Id, match);
                return "Succed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public string UploadVideo(string Id, IFormFile file)
        {

            try
            {
                var match = _matchInfo.Find(x => x.Id == Id).First();
                var tournament = _tournament.Find(x => x.Id == match.TournamentId).First();

                string tournamentName = tournament.Name;
                string matchName = match.MatchName;
                string matchTime = match.MactchTime.ToString("dd-MM-yyyy-HH-mm");

                //match.Videos.Add(UploadVideoForMatch(file, tournamentName, matchName, matchTime));

                _matchInfo.ReplaceOne(m => m.Id == Id, match);
                return "Succed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        private VideoResource UploadVideoForMatch(IFormFile file, string tournamentName, string matchName, string matchTime)
        {
            try
            {
                var videoresource = new VideoResource();
                using var stream = file.OpenReadStream();
                var name = System.Guid.NewGuid();
                var param = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Crop("fill"),
                    PublicId = $"VideoEditing/{tournamentName}/{matchName}-{matchTime}/{name}"
                };
                var uploadResult = _cloudinary.Upload(param);

                if (uploadResult.Error == null)
                {
                    videoresource.PublicId = uploadResult.PublicId;
                    videoresource.Duration = uploadResult.Duration;
                    videoresource.Name = "";
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

        //public async Task<string> ConcatVideoOfMatch(string matchId, List<TrimVideoHightlightModel> models)
        //{
        //    try
        //    {
        //        string response = string.Empty;
        //        var match = _matchInfo.Find(x => x.Id == matchId).First();
        //        if (models.Count > 0)
        //        {
        //            var trans = new Transformation().EndOffset(models[0].EndTime).StartOffset(models[0].StartTime);

        //            for (int i = 1; i < models.Count; i++)
        //            {
        //                trans.Chain().Flags("splice").Overlay(new Layer().PublicId($"video:{models[i].PublicId}")).EndOffset(models[i].EndTime).StartOffset(models[i].StartTime).Chain();
        //            }

        //            var fitstVideo = match.Videos.Where(x => x.PublicId == models[0].PublicId).FirstOrDefault();
        //            if (fitstVideo != null)
        //            {
        //                var name = System.Guid.NewGuid();
        //                var param = new VideoUploadParams
        //                {
        //                    File = new FileDescription(fitstVideo.Url),
        //                    Transformation = models.Count > 1 ? trans.Chain().Flags("layer_apply") : trans,
        //                    PublicId = $"VideoEditing/Highlight/{match.MatchName}-{match.MactchTime.ToString("dd-MM-yyyy-HH-mm")}/{name}"
        //                };
        //                var uploadResult = await _cloudinary.UploadAsync(param);
        //                if (uploadResult.Error == null)
        //                {
        //                    var highlight = new HighlightVideo()
        //                    {
        //                        MatchId = match.Id,
        //                        MatchInfo = $"({match.MatchName})T({match.MactchTime.ToString("dd-MM-yyyy-hh-mm")})",
        //                        Duration = uploadResult.Duration,
        //                        PublicId = uploadResult.PublicId,
        //                        Url = uploadResult.SecureUrl.ToString()
        //                    };
        //                    await _highlight.InsertOneAsync(highlight);
        //                    response = highlight.Url;
        //                }
        //                else
        //                {
        //                    throw new System.Exception(uploadResult.Error.Message);
        //                }
        //            }
        //            else
        //            {
        //                throw new System.Exception("No video in storage video of match!");
        //            }
        //        }
        //        else
        //        {
        //            throw new System.Exception("No video to concat");
        //        }
        //        return response;
        //    }
        //    catch (System.Exception e)
        //    {
        //        throw new System.Exception(e.Message);
        //    }
        //}




        //public async Task<bool> Up()
        //{
        //    try
        //    {
        //        //await _storageService.SaveFile("test", "test.mp4", file);
        //        //await Trim();
        //        //await Concat();
        //        //await test();
        //        return true;
        //    }
        //    catch (System.Exception ex)
        //    {
        //        throw new System.Exception(ex.Message);
        //    }
        //}


        public async Task<bool> Trim()
        {
            try
            {
                var input = Path.Combine(_dir, "test\\test.mp4");
                var output = Path.Combine(_dir, "converted.mp4");
                //var ffmpeg = FFmpeg.

                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));
                // Resource
                var info = await FFmpeg.GetMediaInfo(input);
                var a = info.Duration;

                var videoStream = info.VideoStreams.First().SetCodec(Xabe.FFmpeg.VideoCodec.h264).SetSize(VideoSize.Hd480).Split(System.TimeSpan.FromSeconds(30), System.TimeSpan.FromSeconds(10));
                IStream audioStream = info.AudioStreams.FirstOrDefault()?.SetCodec(AudioCodec.aac);
                await FFmpeg.Conversions.New()
                    .AddStream(videoStream, audioStream)
                    .SetOutput(output)
                    .Start();
                //MediaInfo.Get(input);
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        public async Task<bool> Concat()
        {
            try
            {
                var input = Path.Combine(_dir, "test\\test.mp4");
                var output = Path.Combine(_dir, "converted.mp4");
                var output1 = Path.Combine(_dir, "converted1.mp4");

                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));

                string[] arr = { input, output };

                var conversion = await FFmpeg.Conversions.FromSnippet.Concatenate(output1, arr);
                await conversion.Start();
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        public async Task<bool> Up(string matchId, List<TrimVideoHightlightModel> models)
        {
            try
            {
                //List<string> path = new List<string>();
                //var match = _matchInfo.Find(x => x.Id == matchId).First();

                ////string outputName = 

                //StringBuilder arguments = new StringBuilder();
                //StringBuilder temp = new StringBuilder();
                //StringBuilder inputVideo = new StringBuilder();
                //StringBuilder trimInfo = new StringBuilder();


                //for (int i = 0; i < models.Count; i++)
                //{

                //    path.Add(match.Videos.Where(video => video.PublicId == models[i].PublicId).First().Url);
                //    temp.Append($"[v{i}][a{i}]");
                //    trimInfo.Append($"[{i}:v]trim=start={models[i].StartTime}:end={models[i].EndTime},setpts=PTS-STARTPTS[v{i}];[{i}:a]atrim=start={models[i].StartTime}:end={models[i].EndTime},asetpts=PTS-STARTPTS[a{i}];");

                //}
                //foreach (var item in path)
                //{
                //    inputVideo.Append($"-i {Path.Combine(_dir, item.Replace("/", "\\"))} ");
                //}

                //arguments.Append("-y ");
                //arguments.Append(inputVideo.ToString());
                //arguments.Append("-filter_complex \"");
                //arguments.Append(trimInfo.ToString());

                //arguments.Append($"{temp.ToString()}concat=n={path.Count}:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output.mp4");


                //var arg = $"-y -i {Path.Combine(_dir, "C1_Tota-Vis_09-01-2022-18-04/c5abe37c-4773-4aa6-97e2-31efe226b86d.mp4")} -i {Path.Combine(_dir, "C1_Tota-Vis_09-01-2022-18-04/b748e801-cce3-4457-830a-c2c0798e3936.mp4")} -filter_complex \"[0:v]trim=start=60:end=180,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=60:end=180,asetpts=PTS-STARTPTS[a0];[1:v]trim=start=60:end=120,setpts=PTS-STARTPTS[v1];[1:a]atrim=start=60:end=120,asetpts=PTS-STARTPTS[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output.mp4";

                var a = "-y -i http://118.69.218.59:5050/projects/625925c9b9e572905bcba1c9/raw/video -i http://118.69.218.59:5050/projects/625925ce85ea1d1c82f86ffa/raw/video -filter_complex \"[0:v]trim=start=10:end=20,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=10:end=20,asetpts=PTS-STARTPTS[a0];[1:v]trim=start=10:end=30,setpts=PTS-STARTPTS[v1];[1:a]atrim=start=10:end=30,asetpts=PTS-STARTPTS[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output1234.mp4";

                await Task.Run(() =>
                {
                    string path = Path.Combine(_env.ContentRootPath, "ffmpeg", "ffmpeg.exe");
                    var startInfo = new ProcessStartInfo()
                    {
                        FileName = Path.Combine(_env.ContentRootPath, "ffmpeg", "ffmpeg.exe"),
                        //Arguments = arguments.ToString(),
                        Arguments = a,
                        WorkingDirectory = Path.Combine(_dir, "Highlight"),
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    using (var process = new Process { StartInfo = startInfo })
                    {
                        process.Start();
                        process.WaitForExit();
                    }
                });
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        private async Task<double> getDuration(string path)
        {
            try
            {
                path = path.Replace("/", "\\");
                var input = Path.Combine(_dir, path);
                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));
                var info = await FFmpeg.GetMediaInfo(input);
                return info.Duration.TotalSeconds;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> ConcatVideoOfMatch(string username, ConcatModel concatModel)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == concatModel.MatchId).First();
                //var eventNotQualified = match.JsonFile.Event.Where(x => x.selected == 0).ToList();
                var inputSend = handlePreSendServer(concatModel.JsonFile);
                if (inputSend.logo.Count == 0) inputSend.logo.Add(new List<string>());

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
                    flagTag = true;
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
                if (flagTag)
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


        public async Task<HighlightVideo> GetHighlightVideosById(string highlightId)
        {
            try
            {
                return await _highlight.Find(hl => hl.Id == highlightId).FirstOrDefaultAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<List<string>> NotConcatVideoOfMatch(ConcatModel concatModel)
        {
            try
            {
                var jsonFile = concatModel.JsonFile.Event.Where(x => x.selected != -1).ToList();
                concatModel.JsonFile.Event = jsonFile;

                var inputSend = handlePreSendServer(concatModel.JsonFile);

                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri("http://118.69.218.59:7007");

                var json = JsonConvert.SerializeObject(inputSend);
                json = json.Replace("E", "e");
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/highlight_nomerge", httpContent);
                var result = await response.Content.ReadAsStringAsync();

                var listRes = JsonConvert.DeserializeObject<NotConcatResultModel>(result);
                return listRes.mp4;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public byte[] Download(string url)
        {
            try
            {
                byte[] content;
                using (var client = new WebClient())
                {
                    content = client.DownloadData(url);
                }
                return content;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        #region Download File  
        private (string fileType, byte[] archiveData, string archiveName) DownloadFiles(List<string> urls)
        {
            var zipName = $"video-{DateTime.Now.ToString("yyyy_MM_dd-HH_mm_ss")}.zip";

            byte[] content;

            using (var memoryStream = new MemoryStream())
            {
                using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, false))
                {
                    for (int i = 0; i < urls.Count; i++)
                    {
                        using (var client = new WebClient())
                        {
                            content = client.DownloadData(urls[i]);
                        }
                        var theFile = archive.CreateEntry($"video{i + 1}.ts", CompressionLevel.Optimal);
                        var entryStream = theFile.Open();
                        using var fileToCompressStream = new MemoryStream(content);
                        fileToCompressStream.CopyTo(entryStream);
                        entryStream.Close();
                    }
                }

                return ("application/zip", memoryStream.ToArray(), zipName);
            }

        }

        public async Task<string> DownloadOne(ConcatModel concatModel)
        {
            try
            {
                var inputSend = handlePreSendServer(concatModel.JsonFile);

                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri("http://118.69.218.59:7007");
                var json = JsonConvert.SerializeObject(inputSend);
                json = json.Replace("E", "e");
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/highlight", httpContent);
                var result = await response.Content.ReadAsStringAsync();

                ConcatResultModel model = JsonConvert.DeserializeObject<ConcatResultModel>(result);
                return model.mp4;
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
                inputSend = _mapper.Map<InputSendServer<Eventt>>(input);

                eventts = MapAndAddEvent(eventts, input.Event);

                inputSend.Event = eventts;
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
                        players = item.players,
                        time = item.time,
                        ts = new List<int>(),
                        qualified = item.selected == 0 ? item.selected : 1
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

        public async Task<bool> UpdateLogTrimed(string matchId, EventStorage eventStorage)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                var ev = match.JsonFile.Event.FindIndex(e => e.file_name == eventStorage.file_name);
                if (ev == -1)
                    return false;

                match.JsonFile.Event[ev] = eventStorage;

                _matchInfo.ReplaceOne(m => m.Id == matchId, match);
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> SaveEvent(InputAddEventAndLogo input)
        {
            try
            {
                string publicId = System.Guid.NewGuid().ToString();
                string fileName = input.File.FileName;
                string type = fileName.Substring(fileName.LastIndexOf("."));

                return await _storageService.SaveFileNoFolder($"{publicId}{type}", input.File);
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
        public async Task<List<string>> SaveLogo(InputAddEventAndLogo input)
        {
            try
            {
                string publicId = System.Guid.NewGuid().ToString();
                string fileName = input.File.FileName;
                string type = fileName.Substring(fileName.LastIndexOf("."));
                string file_name = await _storageService.SaveFileNoFolder($"{publicId}{type}", input.File);

                return new List<string> { file_name, input.position.ToString() };
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
        public async Task<List<List<string>>> SaveLogo(string matchId, InputAddEventAndLogo input)
        {
            try
            {
                string publicId = System.Guid.NewGuid().ToString();
                string fileName = input.File.FileName;
                string type = fileName.Substring(fileName.LastIndexOf("."));
                string file_name = await _storageService.SaveFileNoFolder($"{publicId}{type}", input.File);

                var match = _matchInfo.Find(x => x.Id == matchId).First();

                var logo = match.JsonFile.logo;
                if (logo == null)
                {
                    logo = new List<List<string>>();
                }
                int index = -1;
                for (int i = 0; i < logo.Count; i++)
                {
                    if (logo[i][1] == input.position.ToString())
                    {
                        index = i;
                        break;
                    }
                }

                if (index == -1)
                {
                    var logoItem = new List<string> { file_name, input.position.ToString() };
                    logo.Add(logoItem);
                }
                else
                {
                    logo[index][0] = file_name;
                }
                match.JsonFile.logo = logo;
                _matchInfo.ReplaceOne(m => m.Id == matchId, match);
                return logo;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<List<List<string>>> DeleteLogo(string matchId, int position)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                var logo = match.JsonFile.logo;

                int index = -1;
                for (int i = 0; i < logo.Count; i++)
                {
                    if (logo[i][1] == position.ToString())
                    {
                        index = i;
                        break;
                    }
                }

                logo.Remove(logo[index]);
                match.JsonFile.logo = logo;
                _matchInfo.ReplaceOne(m => m.Id == matchId, match);
                return logo;
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


        async void UploadToServerStorage(IFormFile file)
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
                requestContent.Add(bytes, "event", file.FileName);
            }
            var response = await client.PostAsync("/projects/", requestContent);
            var result = await response.Content.ReadAsStringAsync();
        }

        public async Task<string> MergeHL(string username, InputMergeHL input)
        {
            try
            {
                InputSendServer<EventStorage> inputSendServer = new InputSendServer<EventStorage>();
                inputSendServer.Event = input.Event;
                if (input.Logo.Count == 0) input.Logo.Add(new List<string>());
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
    }
}
