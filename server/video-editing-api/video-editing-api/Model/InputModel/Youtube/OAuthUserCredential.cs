namespace video_editing_api.Model.InputModel.Youtube
{
    public class OAuthUserCredential
    {
        public string project_id { get; set; }
        public string client_id { get; set; }

        public string client_secret { get; set; }

        public string auth_uri { get; set; }

        public string token_uri { get; set; }

        public string[] redirect_uris { get; set; }
    }
}
