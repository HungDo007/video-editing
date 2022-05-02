using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using System;

namespace video_editing_api.Model.Collection
{
    [CollectionName("Users")]
    public class AppUser : MongoIdentityUser<Guid>
    {
        public string FullName { get; set; }
    }
}
