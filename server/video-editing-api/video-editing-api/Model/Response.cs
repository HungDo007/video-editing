using System.Collections.Generic;

namespace video_editing_api.Model
{
    public class Response<T>
    {
        public int Status { get; set; }
        public string Description { get; set; }
        public T Data { get; set; }

        public Response(int status, string description, T data)
        {
            Status = status;
            Description = description;
            Data = data;
        }
    }
}
