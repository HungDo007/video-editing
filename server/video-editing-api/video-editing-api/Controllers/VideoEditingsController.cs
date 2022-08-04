﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;
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
                var res = await _videoEditingService.ConcatVideoOfMatch(User.Identity.Name, concatModel);
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
                var res = await _videoEditingService.NotConcatVideoOfMatch(User.Identity.Name, concatModel);
                return Ok(new Response<List<string>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("test")]
        [AllowAnonymous]
        public async Task<IActionResult> Test(InputSendServer<Eventt> a)
        {
            HttpClient client = new HttpClient();
            client.Timeout = TimeSpan.FromDays(1);
            client.BaseAddress = new System.Uri("https://store.cads.live");

            var json = JsonConvert.SerializeObject(a);
            json = json.Replace("E", "e");
            var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync("/projects/merge", httpContent);
            var result = await response.Content.ReadAsStringAsync();
            return Ok();
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
        public async Task<IActionResult> getTeam(string leagueId)
        {
            try
            {
                var res = await _videoEditingService.GetTeam(User.Identity.Name, leagueId);
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
        public async Task<IActionResult> downloadone(ConcatModel concatModel)
        {
            try
            {
                var res = await _videoEditingService.DownloadOne(User.Identity.Name, concatModel);
                return Ok(new Response<string>(200, "", res));
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


        [HttpPost("updateAll/{matchId}")]
        public async Task<IActionResult> updateLogTrimmedAll(string matchId, int selected)
        {
            try
            {
                var res = await _videoEditingService.UpdateLogTrimedAll(matchId, selected);
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



        [HttpPost("SaveToGallery")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> saveToGallery([FromForm] GalleryInput input)
        {
            try
            {
                var res = await _videoEditingService.SaveToGallery(User.Identity.Name, input);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
        [HttpGet("getGallery")]
        public async Task<IActionResult> getGallery(int type)
        {
            try
            {
                var res = await _videoEditingService.getGalley(User.Identity.Name, type);
                return Ok(new Response<List<Gallery>>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpDelete("deleteGallery/{id}")]
        public async Task<IActionResult> deleteGallery(string id)
        {
            try
            {
                var res = await _videoEditingService.deleteGallery(id);
                return Ok(new Response<bool>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("ShareYoutube")]
        public async Task<IActionResult> shareYoutube([FromForm] VideoUploadModel model)
        {
            try
            {
                var res = await _videoEditingService.getUriRedirect(model);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }


        [HttpGet("share/authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> ShareAuthor(string code, string state)
        {
            try
            {
                //Thread thead = new Thread(() =>
                //{
                //    _videoEditingService.HandleCode(code);
                //});
                //thead.IsBackground = true;
                //thead.Start();
                await _videoEditingService.HandleCode(code, state);
                return Ok("Successs!!!");
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}