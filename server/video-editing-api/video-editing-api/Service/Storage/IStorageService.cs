using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace video_editing_api.Service.Storage
{
    public interface IStorageService
    {
        Task<string> SaveFile(string folderName, string fileName, IFormFile file);
        Task DeleteFileAsync(string fileName);
    }
}
