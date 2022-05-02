using AspNetCore.Identity.MongoDbCore.Models;
using MongoDbGenericRepository.Attributes;
using System;

namespace video_editing_api.Model.Collection
{
    [CollectionName("Roles")]
    public class AppRole : MongoIdentityRole<Guid>
    {
    }
}
