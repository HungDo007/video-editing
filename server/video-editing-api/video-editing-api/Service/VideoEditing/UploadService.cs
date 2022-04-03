using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace video_editing_api.Service.VideoEditing
{
    public class UploadService : IUploadService
    {
        private readonly Cloudinary _cloudinary;
        public UploadService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
                );

            _cloudinary = new Cloudinary(account);
        }
        public async Task<string> UploadVideo(IFormFile file)
        {
            try
            {
                await using var stream = file.OpenReadStream();
                var name = Guid.NewGuid();
                var param = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    //Transformation = new Transformation().EndOffset("10").StartOffset("5"),
                    PublicId = $"VideoEditing/{name}"
                };

                var uploadResult = await _cloudinary.UploadAsync(param);

                return "Succed";
            }
            catch(System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
    }
}
