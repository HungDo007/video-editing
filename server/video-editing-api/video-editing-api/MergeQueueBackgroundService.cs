using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Service;
using video_editing_api.Service.DBConnection;

namespace video_editing_api
{
    public class MergeQueueBackgroundService : BackgroundService
    {
        private readonly string _baseUrl;
        private readonly IServiceProvider _serviceProvider;
        private readonly IHubContext<NotiHub> _hub;
        public MergeQueueBackgroundService(IConfiguration configuration, IServiceProvider serviceProvider, IHubContext<NotiHub> hub)
        {
            _baseUrl = configuration["BaseUrlMergeVideo"];
            _serviceProvider = serviceProvider;
            _hub = hub;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {

                if (BackgroundQueue.MergeQueue.Count > 0)
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var dbClient = scope.ServiceProvider.GetRequiredService<IDbClient>();
                        var higlight = dbClient.GetHighlightVideoCollection();
                        Console.WriteLine("send " + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));

                        MergeQueueInput input = BackgroundQueue.MergeQueue.Dequeue();
                        string message = string.Empty;
                        if (input.Status == 0)
                        {
                            message = await HandleSendServer(input, higlight);
                        }
                        else if (input.Status == 1)
                        {
                            message = await HandleSendServerNotMerge(input, higlight);
                        }
                        await _hub.Clients.Group(input.Username).SendAsync("noti", input.Status == 0 ? "background_task" : "background_no_merge", message);
                        Console.WriteLine("done" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                    }
                }
                else
                {
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                }
            }
        }


        private async Task<string> HandleSendServer(MergeQueueInput input, IMongoCollection<HighlightVideo> _highlight)
        {
            HighlightVideo hl = new HighlightVideo();
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri(_baseUrl);
                input.JsonFile.merge = 1;
                var json = JsonConvert.SerializeObject(input.JsonFile);
                json = json.Replace("E", "e");
                Console.WriteLine("json " + json);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/projects/merge", httpContent);

                hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    ConcatResultModel model = JsonConvert.DeserializeObject<ConcatResultModel>(result);
                    if (hl != null)
                    {
                        hl.mp4 = model.mp4;
                        hl.ts = model.ts;
                        hl.Status = SystemConstants.HighlightStatusSucceed;
                    }
                    await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
                }
                else
                {
                    Console.WriteLine("error server thầy" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                    hl.Status = SystemConstants.HighlightStatusFailed;
                    await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("error" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();
                hl.Status = SystemConstants.HighlightStatusFailed;
                await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
            }

            return JsonConvert.SerializeObject(hl);
        }

        private async Task<string> HandleSendServerNotMerge(MergeQueueInput input, IMongoCollection<HighlightVideo> _highlight)
        {
            HighlightVideo hl = new HighlightVideo();
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri(_baseUrl);
                input.JsonFile.merge = 0;
                var json = JsonConvert.SerializeObject(input.JsonFile);
                json = json.Replace("E", "e");
                Console.WriteLine("json " + json);

                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/projects/merge", httpContent);



                hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    var listRes = JsonConvert.DeserializeObject<NotConcatResultModel>(result);
                    if (hl != null)
                    {
                        hl.list_mp4 = listRes.mp4;
                        hl.Status = SystemConstants.HighlightStatusSucceed;
                    }
                    await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
                }
                else
                {
                    Console.WriteLine("error server thầy" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                    hl.Status = SystemConstants.HighlightStatusFailed;
                    await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("error" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();
                hl.Status = SystemConstants.HighlightStatusFailed;
                await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
            }

            return JsonConvert.SerializeObject(hl);
        }
    }
}
