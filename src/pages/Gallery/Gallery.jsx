import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { firestore } from "../../firebase/config";
import CustomButton from "../../componentz/CustomButton/CustomButton";
import Spacing from "../../componentz/Spacing/Spacing";
import placeholder from "../../assetz/images/placeholder.png";

import "./styles.scss";
import GalleryPreview from "../../componentz/GalleryPreview/GalleryPreview";

const Gallary = () => {
  const location = useLocation().pathname;
  const endpoint = location.split("/")[location.split("/").length - 1];
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [noPost, setNoPost] = useState(false);
  const [onEndReachedCalled, setOnEndReachedCalled] = useState(false);
  const [galleryRef] = useState(firestore.collection("gallery"));

  const onLoadGallery = () => {
    setIsLoading(true);
    const slug = galleryRef.orderBy("created_at", "desc").limit(10);
    slug.onSnapshot((snapshot) => {
      if (snapshot.empty) {
        setNoPost(true);
        return;
      }
      let newGallery = [];
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      for (let i = 0; i < snapshot.docs.length; i++) {
        newGallery.push(snapshot.docs[i].data());
      }
      setGallery(newGallery);
    });
  };
  const onLoadMoreGallery = async () => {
    if (lastDoc) {
      setOnEndReachedCalled(false);
      setIsMoreLoading(true);
      const slug = await galleryRef
        .orderBy("created_at")
        .startAfter(lastDoc.data().created_at)
        .limit(10);
      slug.onSnapshot((snapShot) => {
        if (!snapShot.empty) {
          let newGallery = gallery;

          setLastDoc(snapShot.docs[snapShot.docs.length - 1]);

          for (let i = 0; i < snapShot.docs.length; i++) {
            newGallery.push(snapShot.docs[i].data());
          }

          setGallery(newGallery);
          if (snapShot.docs.length < 10) setLastDoc(null);
        } else {
          setLastDoc(null);
        }
      });
      setIsMoreLoading(false);
    }
  };
  useEffect(() => {
    onLoadGallery();
  }, [""]);
  return (
    <div className="tag-overview">
      <div
        className="hero"
        style={{
          backgroundImage:
            endpoint === "for-parents"
              ? `linear-gradient(#cac492b4, #cac4923f), url(${placeholder})`
              : endpoint === "for-siblings"
              ? `linear-gradient(#cac492b4, #cac4923f), url(${placeholder})`
              : `linear-gradient(#cac492b4, #cac4923f), url(${placeholder})`,
        }}
      >
        <div className="hero-text-wrapper">
          <h1 className="hero-title">GALLERY</h1>
          <Spacing height={`6em`} />
          <p className="hero-description"></p>
        </div>
      </div>
      <Spacing height={`6em`} />
      <div className="flex-vertical-center gallery">
        {gallery.map((item, index) => (
          <GalleryPreview key={index} data={item} />
        ))}
      </div>
      {onEndReachedCalled && <CustomButton label={`LOAD MORE`} />}
    </div>
  );
};

export default Gallary;
