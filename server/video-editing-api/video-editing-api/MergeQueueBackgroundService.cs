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
using video_editing_api.Service.DBConnection;

namespace video_editing_api
{
    public class MergeQueueBackgroundService : BackgroundService
    {
        private readonly string _baseUrl;
        private readonly IServiceProvider _serviceProvider;
        public MergeQueueBackgroundService(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _baseUrl = configuration["BaseUrlMergeVideo"];
            _serviceProvider = serviceProvider;
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
                        await HandleSendServer(input, higlight);

                        Console.WriteLine("done" + DateTime.Now.ToString("dd-MM-yyy hh:mm:ss"));
                    }
                }
                else
                {
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
                }
            }
        }


        private async Task HandleSendServer(MergeQueueInput input, IMongoCollection<HighlightVideo> _highlight)
        {
            try
            {
                HttpClient client = new HttpClient();
                client.Timeout = TimeSpan.FromDays(1);
                client.BaseAddress = new System.Uri(_baseUrl);

                var json = JsonConvert.SerializeObject(input.JsonFile);
                json = json.Replace("E", "e");
                Console.WriteLine("json " + json);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/highlight", httpContent);

                HighlightVideo hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();

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
                HighlightVideo hl = _highlight.Find(hl => hl.Id == input.IdHiglight).FirstOrDefault();
                hl.Status = SystemConstants.HighlightStatusFailed;
                await _highlight.ReplaceOneAsync(hl => hl.Id == input.IdHiglight, hl);
            }
        }
    }
}
