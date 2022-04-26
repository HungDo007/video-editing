import { Tooltip } from "@mui/material";
import "./custom-bar.styles.scss";

//const CustomBar = ({ videos, duration, setIndex }) => {
const CustomBar = ({ videos, setIndex }) => {
  const handleClick = (index) => {
    setIndex(index);
  };
  return (
    <span className="bar-block">
      <div
        className="bar-len"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {videos?.map((item, index) => {
          // let a = 0;
          // for (let i = index; i >= 0; i--) {
          //   a += videos[i] ? videos[i].ts[1] - videos[i].ts[0] : 0;
          // }
          // a -= item.ts[1] - item.ts[0];
          // let percent = (a / duration) * 100;
          return (
            <Tooltip key={index} title={item.event} placement="top">
              <div
                key={index}
                className="bar-item"
                style={{
                  // marginLeft: "20px",
                  position: "relative",
                  //left: `${percent}%`,
                }}
                onClick={() => handleClick(index)}
              >
                <div
                  style={{
                    marginTop: index % 2 === 0 ? 40 : -40,
                    color: "black",
                    whiteSpace: "nowrap",
                  }}
                ></div>
                <input className="bar-item-ip" />
              </div>
            </Tooltip>
          );
        })}
      </div>
    </span>
  );
};

export default CustomBar;
