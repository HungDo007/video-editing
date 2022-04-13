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

        public StorageService(IWebHostEnvironment webHostEnvironment)
        {
            _rootFolder = webHostEnvironment.WebRootPath;
        }


        public async Task<string> SaveFile(string folderName, string fileName, IFormFile file)
        {
            try
            {
                string saveFolder = Path.Combine(_rootFolder, folderName);

                if (!Directory.Exists(saveFolder))
                    Directory.CreateDirectory(saveFolder);

                //using var mediaBinaryStream = file.OpenReadStream();
                string filePath = Path.Combine(saveFolder, fileName);
                using var output = new FileStream(filePath, FileMode.Create, FileAccess.Write);
                //await mediaBinaryStream.CopyToAsync(output);
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
