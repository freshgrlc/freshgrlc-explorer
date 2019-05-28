import React from "react";
import { Row } from "./Row/Row.component";

// import classes from "./NetworkInfo.module.scss";

interface IProps {}

export const NetworkInfo: React.FC<IProps> = () => {
  return (
    <div>
      <Row
        label="Latest Block"
        cells={[
          {
            label: "Height",
            data: "300000",
          },
          {
            label: "Recieved at"
          }
        ]}
      />
      <Row
        label="Difficulty"
        cells={[
          {
            label: "Network",
            data: "38.461",
          },
          {
            label: "Adjusted (50 coins/min)",
            data: "26.282"
          }
        ]}
      />
    </div>
  );
};
