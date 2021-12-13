import React from "react";
import Spacing from "../Spacing/Spacing";

import "./styles.scss";

const GalleryPreview = ({ data: { created_at, photoUrl } }) => {
  // const time = new Date(created_at).getTime();
  // const OnClick = () => {};
  return (
    <div className="flex-center-column photo-preview" onClick={() => {}}>
      <Spacing height="1em" />
      <img src={photoUrl} alt="" className="gallary-image" />
      <Spacing height="1em" />
      <div className="controls">
        {/* <span
          className={`time`}
          style={{
            color: colors.for_carers,
          }}
        >
          {moment().fromNow(time)}
        </span> */}
      </div>
    </div>
  );
};

export default GalleryPreview;
