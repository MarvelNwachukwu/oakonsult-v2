import React, { useState } from "react";
import { Entypo } from "react-web-vector-icons";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import CustomButton from "../../CustomButton/CustomButton";
import Dialog from "../../Dialog/Dialog";
import Spacing from "../../Spacing/Spacing";
import AddGallery from "../AddGallery/AddGallery";
import Spinner from "../../Spinner/Spinner";
import trashIcon from "../../../assetz/icons/trashIcon.svg";

import "./styles.scss";
import { firestore } from "../../../firebase/config";

const GalleryOverView = ({ hasGallery, gallery, loading }) => {
  const [type, setType] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  return loading ? (
    <Spinner style={{ height: "30vh" }} />
  ) : (
    <>
      {!hasGallery ? (
        <div className="flex-center-column no-data">
          <Spacing height="4em" />
          <span className="no-data-text">You have'nt added any photo yet</span>
          <Spacing height="2em" />
          <CustomButton
            label="Add Photo"
            className="add-photo-btn"
            onClick={() => {
              setType("addPhoto");
              setDialogVisible(true);
            }}
          />
        </div>
      ) : (
        <div className="has-data">
          <CustomButton
            label="Add Photo"
            className="add-photo-btn absolute-btn"
            onClick={() => {
              setType("addPhoto");
              setDialogVisible(true);
            }}
          />
          <Spacing height="2em" />
          <div className="flex-vertical-center photo-list">
            {gallery.map((item, index) => (
              <div
                key={index}
                className="flex-center-column photo-preview"
                onClick={() => {
                  // dispatch(setGallery(item));
                  // history.push(`/gallery/${item.photoCode}`);
                }}
              >
                <Spacing height="1em" />
                <img src={item.photoUrl} alt="" className="gallary-image" />
                <Spacing height="1em" />
                <div className="controls">
                  <div
                    className="ctrl trash"
                    onDoubleClick={() => {
                      firestore.collection("gallery").doc(item.id).delete();
                    }}
                  >
                    <img src={trashIcon} alt="trash" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Dialog dialogVisible={dialogVisible} setDialogVisible={setDialogVisible}>
        {type === "addPhoto" && (
          <AddGallery setDialogVisible={setDialogVisible} />
        )}
      </Dialog>
    </>
  );
};

export default GalleryOverView;
