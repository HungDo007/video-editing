using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace video_editing_api.Service.VideoEditing
{
    public interface IUploadService
    {
        Task<string> UploadVideo(IFormFile file);
    }
}
