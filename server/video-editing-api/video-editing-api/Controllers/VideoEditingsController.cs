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
    public class VideoEditingsController : ControllerBase
    {
        private readonly IVideoEditingService _videoEditingService;

        public VideoEditingsController(IVideoEditingService videoEditingService)
        {
            _videoEditingService = videoEditingService;
        }


        [HttpGet("getAction")]
        public async Task<IActionResult> GetActions()
        {
            try
            {
                var result = await _videoEditingService.GetActions();
                return Ok(new Response<List<Action>>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<List<Action>>(400, e.Message, null));
            }
        }
        [HttpPost("addAction")]
        public async Task<IActionResult> AddAction([FromBody] List<Action> actions)
        {
            try
            {
                var result = await _videoEditingService.AddAction(actions);
                return Ok(new Response<string>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
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
                var result = await _videoEditingService.GetMatchInfo(Id);
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
                var result = await _videoEditingService.GetMatchInfo();
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
                var result = await _videoEditingService.AddMatchInfo(matchInfo);
                return Ok(new Response<string>(200, "", result));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }



        [HttpGet("getHighligth")]
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
        [HttpPost("concatHighlight/{matchId}")]
        public async Task<IActionResult> UpLoadVideo(string matchId, List<TrimVideoHightlightModel> models)
        {
            try
            {
                string res = await _videoEditingService.ConcatVideoOfMatch(matchId, models);
                //bool res = await _videoEditingService.Up(matchId, models);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("uploadVideoForMatch/{matchId}")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UpLoadVideo(string matchId, IFormFile file)
        {
            try
            {
                string res = await _videoEditingService.UploadVideoForMatch(matchId, file);
                return Ok(new Response<string>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }

        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Up(string matchId, List<TrimVideoHightlightModel> models)
        {
            try
            {
                bool res = await _videoEditingService.Up(matchId, models);
                return Ok(new Response<bool>(200, "", res));
            }
            catch (System.Exception e)
            {
                return BadRequest(new Response<string>(400, e.Message, null));
            }
        }
    }
}
