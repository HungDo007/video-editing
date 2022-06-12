
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace video_editing_api.Service.Storage
{
    public class StorageService : IStorageService
    {
        private readonly string _rootFolder;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public StorageService(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _rootFolder = webHostEnvironment.WebRootPath;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<string> SaveFile(string folderName, string fileName, IFormFile file)
        {
            try
            {
                string saveFolder = Path.Combine(_rootFolder, folderName);

                if (!Directory.Exists(saveFolder))
                    Directory.CreateDirectory(saveFolder);

                string filePath = Path.Combine(saveFolder, fileName);
                using var output = new FileStream(filePath, FileMode.Create, FileAccess.Write);

                {
                    await file.CopyToAsync(output);
                }
                return folderName + "/" + fileName;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> SaveFileNoFolder(string fileName, IFormFile file)
        {
            try
            {
                string filePath = Path.Combine(_rootFolder, fileName);
                using var output = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                {
                    await file.CopyToAsync(output);
                }
                return $"https://{_httpContextAccessor.HttpContext.Request.Host.Value}/{fileName}";
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteFileAsync(string fileName)
        {
            try
            {
                fileName = fileName.Replace("/", "\\");
                string filePath = _rootFolder + fileName;

                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
