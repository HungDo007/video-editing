import "./custom-bar.styles.scss";

const CustomBar = ({ videos, duration, setIndex }) => {
  const handleClick = (index) => {
    setIndex(index);
  };

  return (
    <span className="bar-block">
      <span className="bar-len">
        {videos.map((item, index) => {
          let a = 0;
          for (let i = index; i >= 0; i--) {
            a += videos[i]?.duration;
          }
          a -= item.duration;
          let percent = (a / duration) * 100;
          return (
            <span
              key={index}
              className="bar-item"
              style={{
                left: `${percent}%`,
              }}
              onClick={() => handleClick(index)}
            >
              <input className="bar-item-ip" />
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default CustomBar;
