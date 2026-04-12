import { Signal } from "@vaadin/hilla-react-signals";
import { Button } from "@vaadin/react-components";
import { Dialog } from "@vaadin/react-components/Dialog.js";
import React from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";

interface ChildProps {
  modalOpen: Signal<boolean>
  image: Signal<string | undefined>
  imageResult : Signal<string | undefined>
  // cropHasDone : Signal<boolean>
}

export const CropperModal = ({ modalOpen ,image, imageResult } : ChildProps)=>{
  const cropperRef = React.useRef<CropperRef>(null);

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        imageResult.value = canvas.toDataURL()
        // cropHasDone.value=true
        modalOpen.value=false
      }
    }
  };
  return(
    <Dialog
  headerTitle="New employee"
  opened={modalOpen.value}
  onClosed={() => {
    modalOpen.value = false
  }}
  footer={
    <>
      <Button
        onClick={() => {
          onCrop()
        }}
      >
        Crop
      </Button>
      <Button
        onClick={() => {
          modalOpen.value=false
        }}
      >
        Cancel
      </Button>
      
    </>
  }
>
 <Cropper src={image.value} ref={cropperRef} />

</Dialog>
  )
}