using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using video_editing_api.Model;
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
        public IActionResult GetActions()
        {
            return Ok(_videoEditingService.GetActions());
        }
        
        [HttpPost("addAction")]
        public IActionResult AddAction([FromBody] List<Action> actions)
        {
            return Ok(_videoEditingService.AddAction(actions));
        }
    }
}
