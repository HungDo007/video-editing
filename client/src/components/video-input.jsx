import { useState } from "react";

const VideoInput = () => {
  const [videoSrc, setVideoSrc] = useState();

  const handleChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    console.log(url);
    setVideoSrc(url);
  };

  return (
    <div>
      <input
        hidden
        id="raised-button-file"
        type="file"
        onChange={handleChange}
      />
      {videoSrc ? (
        <video src={videoSrc} width="100%" height={300} controls />
      ) : (
        <label htmlFor="raised-button-file">
          <button>Choose</button>
        </label>
      )}
    </div>
  );
};

export default VideoInput;
