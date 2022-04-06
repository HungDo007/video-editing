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
            <div
              key={index}
              className="bar-item"
              style={{
                left: `${percent}%`,
              }}
              onClick={() => handleClick(index)}
            >
              <div
                style={{
                  marginTop: index % 2 === 0 ? 40 : -40,
                  color: "black",
                  whiteSpace: "nowrap",
                }}
              >
                <small>{item.name}</small>
              </div>
              <input className="bar-item-ip" />
            </div>
          );
        })}
      </span>
    </span>
  );
};

export default CustomBar;
