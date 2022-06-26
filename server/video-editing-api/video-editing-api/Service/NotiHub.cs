using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using video_editing_api.Model.InputModel;

namespace video_editing_api.Service
{
    public class NotiHub : Hub
    {

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            //await Clients.Group(userConnection.Username).SendAsync("noti", "background_task", "joined");
        }

    }
}
