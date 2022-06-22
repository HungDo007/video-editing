using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Service.VideoEditing;

namespace video_editing_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VideoEditingsController : ControllerBase
    {
        private readonly IVideoEditingService _videoEditingService;

        public VideoEditingsController(IVideoEditingService videoEditingService)
        {
            _videoEditingService = videoEditingService;
        }



        [HttpGet("getTournamentById")]
        public async Task<IActionResult> GetTournament(string Id)
        {
            try
            {
                var result = await _videoEditingService.GetTournament(Id);
                return Ok(new Response<Tournament>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<Tournament>(400, e.Message, null));
            }
        }
        [HttpGet("getTournament")]
        public async Task<IActionResult> GetTournament()
        {
            try
            {
                var result = await _videoEditingService.GetTournament();
                return Ok(new Response<List<Tournament>>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<Tournament>>(400, e.Message, null));
            }
        }
        [HttpPost("addTournament")]
        public async Task<IActionResult> AddTournament([FromBody] List<Tournament> tournaments)
        {
            try
            {
                var result = await _videoEditingService.AddTournament(tournaments);
                return Ok(new Response<string>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }




        [HttpGet("getMatchById")]
        public async Task<IActionResult> GetMatch(string Id)
        {
            try
            {
                var result = await _videoEditingService.GetInfoOfMatch(Id);
                return Ok(new Response<MatchInfo>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<MatchInfo>>(400, e.Message, null));
            }
        }
        [HttpGet("getMatch")]
        public async Task<IActionResult> GetMatch()
        {
            try
            {
                var username = User.Identity.Name;
                var result = await _videoEditingService.GetMatchInfo(username);
                return Ok(new Response<List<MatchInfo>>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<MatchInfo>>(400, e.Message, null));
            }
        }
        [HttpPost("addMatch")]
        public async Task<IActionResult> AddMatch([FromBody] MatchInfo matchInfo)
        {
            try
            {
                var username = User.Identity.Name;
                var result = await _videoEditingService.AddMatchInfo(username, matchInfo);
                return Ok(new Response<string>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpDelete("deleteMatch/{matchId}")]
        public async Task<IActionResult> DeleteMatch(string matchId)
        {
            try
            {
                var result = await _videoEditingService.DeleteMatch(matchId);
                return Ok(new Response<bool>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpDelete("deleteHighlight/{id}")]
        public async Task<IActionResult> DeleteHighlight(string id)
        {
            try
            {
                var result = await _videoEditingService.DeleteHighlight(id);
                return Ok(new Response<bool>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpGet("getHighlight")]
        public async Task<IActionResult> GeHighligth()
        {
            try
            {
                var res = await _videoEditingService.GetHighlightVideos();
                return Ok(new Response<List<HighlightVideo>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<HighlightVideo>>(400, e.Message, null));
            }
        }
        [HttpGet("getHighlightOfMatch/{matchId}")]
        public async Task<IActionResult> GeHighligthOfMatch(string matchId)
        {
            try
            {
                var res = await _videoEditingService.GetHighlightVideosForMatch(matchId);
                return Ok(new Response<List<HighlightVideo>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<HighlightVideo>>(400, e.Message, null));
            }
        }
        [HttpGet("getHighlightHL")]
        public async Task<IActionResult> GeHighligthHL()
        {
            try
            {
                var res = await _videoEditingService.GetHighlightVideosHL(User.Identity.Name);
                return Ok(new Response<List<HighlightVideo>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<HighlightVideo>>(400, e.Message, null));
            }
        }


        [HttpPost("concatHighlight")]
        public async Task<IActionResult> ConcatVideo(ConcatModel concatModel)
        {
            try
            {
                var res = await _videoEditingService.ConcatVideoOfMatch(concatModel);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpPost("notConcatHighlight")]
        public async Task<IActionResult> NotConcatVideo(ConcatModel concatModel)
        {
            try
            {
                var res = await _videoEditingService.NotConcatVideoOfMatch(concatModel);
                return Ok(new Response<List<string>>(200, "", res));
                //return File(res, "application/zip", "videos.zip");
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("uploadJson/{matchId}")]
        public async Task<IActionResult> UploadJson(string matchId, IFormFile jsonfile)
        {
            try
            {
                var res = await _videoEditingService.UploadJson(User.Identity.Name, matchId, jsonfile);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }


        [HttpPost("uploadSmallVideo")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadSmallVideo([FromForm] InputAddEventAndLogo input)
        {
            try
            {
                string file_name = await _videoEditingService.SaveEvent(input);
                var res = new
                {
                    Event = input.eventName,
                    file_name = file_name
                };
                return Ok(new Response<object>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpPost("uploadLogo")]
        public async Task<IActionResult> UploadLogo([FromForm] InputAddEventAndLogo input)
        {
            try
            {
                var res = await _videoEditingService.SaveLogo(input);
                return Ok(new Response<List<string>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("uploadLogo/{matchId}")]
        public async Task<IActionResult> UploadLogo(string matchId, [FromForm] InputAddEventAndLogo input)
        {
            try
            {
                var res = await _videoEditingService.SaveLogo(matchId, input);
                return Ok(new Response<List<List<string>>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpPost("deleteLogo/{matchId}/{position}")]
        public async Task<IActionResult> DeleteLogo(string matchId, int position)
        {
            try
            {
                var res = await _videoEditingService.DeleteLogo(matchId, position);
                return Ok(new Response<List<List<string>>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpGet("download")]
        [AllowAnonymous]
        public IActionResult download(string url)
        {
            try
            {
                byte[] content = _videoEditingService.Download(url);
                return File(content, "video/mp2t", "video.ts");
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpGet("getTag")]
        public async Task<IActionResult> getTag()
        {
            try
            {
                var res = await _videoEditingService.GetTag(User.Identity.Name);
                return Ok(new Response<List<Tag>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpGet("getTeam")]
        public async Task<IActionResult> getTeam(string username)
        {
            try
            {
                var res = await _videoEditingService.GetTeam(User.Identity.Name);
                return Ok(new Response<List<Team>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("mergeHL")]
        public async Task<IActionResult> mergeHL(InputMergeHL input)
        {
            try
            {
                var res = await _videoEditingService.MergeHL(User.Identity.Name, input);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("getJsonFromTag")]
        public async Task<IActionResult> getJsonFromTag(HighlightFilterByTagRequest request)
        {
            try
            {
                var res = await _videoEditingService.GetJsonFromTag(User.Identity.Name, request);
                return Ok(new Response<List<EventStorage>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("download")]
        [AllowAnonymous]
        public async Task<IActionResult> downloadone(ConcatModel concatModel)
        {
            try
            {
                var res = await _videoEditingService.DownloadOne(concatModel);
                return Ok(new Response<string>(200, "", res));
                //return File(content, "video/mp2t", "video.ts");
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("updateLogTrimmed/{matchId}")]
        public async Task<IActionResult> updateLogTrimmed(string matchId, EventStorage eventStorage)
        {
            try
            {
                var res = await _videoEditingService.UpdateLogTrimed(matchId, eventStorage);
                if (res)
                    return Ok(new Response<bool>(200, "", res));
                else
                    return BadRequest(new Response<bool>(400, "don't find event", false));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        //[HttpPost("concatHighlight/{matchId}")]
        //public async Task<IActionResult> UpLoadVideo(string matchId, List<TrimVideoHightlightModel> models)
        //{
        //    try
        //    {
        //        //string res = await _videoEditingService.ConcatVideoOfMatch(matchId, models);
        //        bool res = await _videoEditingService.Up(matchId, models);
        //        return Ok(new Response<string>(200, "", "res"));
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}

        //[HttpPost("uploadVideoForMatch/{matchId}")]
        //[DisableRequestSizeLimit]
        //public async Task<IActionResult> UpLoadVideo(string matchId, IFormFile file)
        //{
        //    try
        //    {
        //        string res = await _videoEditingService.UploadVideoForMatch(matchId, file);
        //        return Ok(new Response<string>(200, "", res));
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}

        //[HttpPost("upload")]
        //[DisableRequestSizeLimit]
        //public async Task<IActionResult> Up(string matchId, List<TrimVideoHightlightModel> models)
        //{
        //    try
        //    {
        //        bool res = await _videoEditingService.Up(matchId, models);
        //        return Ok(new Response<bool>(200, "", res));
        //    }
        //    catch (System.Exception e)
        //    {
        //        return BadRequest(new Response<string>(400, e.Message, null));
        //    }
        //}


        //[HttpPost("test")]
        //public async Task<IActionResult> asdf(IFormFile file)
        //{
        //    var client = new MinioClient().WithEndpoint("118.69.218.59:9002").WithCredentials("cadsfpt", "As2fQkAZjh").Build();

        //    //byte[] bs = System.IO.File.ReadAllBytes("D:\\video-editing\\server\\video-editing-api\\video-editing-api\\wwwroot\\Highlight\\output.mp4");
        //    //byte[] bs = Convert(file);
        //    //System.IO.MemoryStream filestream = new System.IO.MemoryStream(bs);
        //    //// Specify SSE-C encryption options
        //    //Aes aesEncryption = Aes.Create();
        //    //aesEncryption.KeySize = 256;
        //    //aesEncryption.GenerateKey();
        //    //var ssec = new SSEC(aesEncryption.Key);

        //    //PutObjectArgs putObjectArgs = new PutObjectArgs()
        //    //                                           .WithBucket("video-editing")
        //    //                                           .WithObject($"test/{file.FileName}")
        //    //                                           .WithStreamData(filestream)
        //    //                                           .WithContentType(file.ContentType);
        //    //await client.PutObjectAsync(putObjectArgs).ConfigureAwait(false);



        //    GetObjectArgs getObjectArgs = new GetObjectArgs().WithBucket("video-editing").WithObject("output.mp4");
        //    var a = await client.GetObjectAsync(getObjectArgs).ConfigureAwait(false);

        //    // await client.PutObjectAsync("video-editing", "test.mp4", "D:\\video-editing\\server\\video-editing-api\\video-editing-api\\wwwroot\\Highlight\\output.mp4", "application/octet-stream", sse: ssec);

        //    return Ok(a);
        //}


        //[HttpPost]
        //public async Task<IActionResult> test123(InputSendServer file)
        //{
        //    //string a = string.Empty;
        //    //using (var reader = new StreamReader(file.OpenReadStream()))
        //    //{
        //    //    a = await reader.ReadToEndAsync();
        //    //}
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new System.Uri("http://118.69.218.59:7007");
        //    //var temp = new
        //    //{
        //    //    json = a
        //    //};
        //    var json = JsonConvert.SerializeObject(file);
        //    json = json.Replace("E", "e");
        //    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
        //    //var response = await client.PostAsJsonAsync("/highlight", temp);
        //    var response = await client.PostAsync("/highlight", httpContent);
        //    var result = await response.Content.ReadAsStringAsync();

        //    return Ok();
        //}

        //private byte[] Convert(IFormFile file)
        //{
        //    byte[] fileBytes = { };
        //    if (file.Length > 0)
        //    {
        //        using (var ms = new MemoryStream())
        //        {
        //            file.CopyTo(ms);
        //            fileBytes = ms.ToArray();
        //        }
        //    }
        //    return fileBytes;
        //}

    }
}