using AutoMapper;
using video_editing_api.Model.InputModel;

namespace video_editing_api
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<EventStorage, Eventt>();
            CreateMap<InputSendServer<EventStorage>, InputSendServer<Eventt>>();
        }
    }
}
