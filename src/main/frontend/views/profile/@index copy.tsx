import { useTour } from "@reactour/tour"
import { ViewConfig } from "@vaadin/hilla-file-router/types.js"
import { useForm } from "@vaadin/hilla-react-form"
import { Signal, useSignal } from "@vaadin/hilla-react-signals"
import { Button, Dialog, FormLayout, Notification, TextField, Upload, UploadBeforeEvent } from "@vaadin/react-components"
import UserModel from "Frontend/generated/com/example/application/data/UserModel"
import { ProfileService, UploadServices, UserEndpoint, UserService } from "Frontend/generated/endpoints"
import { menuSteps } from "Frontend/steps"
import { useAuth } from "Frontend/util/auth"
import { readAsDataURL } from "promise-file-reader"
import React from "react"
import { useEffect, useState } from "react"
import { Cropper, CropperRef } from "react-advanced-cropper"
// import { Cropper, CropperRef } from "react-advanced-cropper"
// import { useParams } from "react-router"
import "react-advanced-cropper/dist/style.css";
// import "./Cropper.scss";

export const config: ViewConfig = {
    title: 'User Profile',
    loginRequired: true,
    menu: {
        exclude: true, title: 'User Profile'
    }
}

//Modal

interface ChildProps {
  modalOpen: Signal<boolean>
  image: Signal<string | undefined>
  imageResult : Signal<string | undefined>
}

const CropperModal = ({ modalOpen ,image, imageResult } : ChildProps)=>{
  const cropperRef = React.useRef<CropperRef>(null);

  const onCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        imageResult.value = canvas.toDataURL()
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

export default function UserProfile() {
    const  form  = useForm(UserModel,{
      onSubmit: async (user) => {
        if(imageResult.value) {
          user.profilePictureUriData = imageResult.value
        }
        await ProfileService.saveEditWithPicture(user).then((user) => Notification.show(`user ${user.name} berhasil disimpan`))
      }
        
      
    })

   useEffect(()=>{
    const fetchData = async ()=>{
      await UserEndpoint.getAuthenticatedUser().then(result=>{
            form.read(result)
            image.value = result?.profilePictureUriData
            if(result?.hasProfilePicture) imageResult.value = result.profilePictureUriData
        })
      }
    
    fetchData()  
    },[])

     const image = useSignal<string | undefined>(undefined)
     const imageResult = useSignal<string | undefined>(undefined)
     const modalOpen = useSignal<boolean>(false)
    
    // const cropperRef = React.useRef<CropperRef>(null);

    // const onCrop = () => {
    //   const cropper = cropperRef.current
    //   if(cropper) {
    //     const canvas = cropper.getCanvas()
    //     // console.log(canvas?.toDataURL())
    //     if(canvas?.toDataURL)
    //       form.value.profilePictureUriData = canvas?.toDataURL()
    //   }
    // }
  return (
    <FormLayout theme="spacing">
        <TextField {...form.field(form.model.username)} label={'Username'} readonly/>
        <TextField {...form.field(form.model.name)} label={'Name'} />
          <Upload
            maxFiles={1}
            accept='image/*'
            onUploadBefore={async (e: UploadBeforeEvent) =>  {
              e.preventDefault()
              const file = e.detail.file
              if(file) {
                form.value.profilePictureUriData = await readAsDataURL(file)
                form.value.hasProfilePicture = true
                form.value.profilePictureMimeType = file.type
                image.value= form.value.profilePictureUriData
                modalOpen.value = true
              }
              
            }}
        
        />
        {/* <Cropper src={profilePictureUrl.value} ref={cropperRef} />
        <Button onClick={()=>onCrop()}>Crop</Button> */}
        <Button onClick={()=>{
          form.value.profilePictureMimeType=''
          form.value.hasProfilePicture=false
          image.value = undefined
          imageResult.value = undefined
        }}>Remove Profile Picture</Button>
        <img src={imageResult.value}  />
        <CropperModal modalOpen={modalOpen} image={image} imageResult={imageResult}  />
        <Button onClick={form.submit} disabled={form.submitting}>Simpan</Button>
    </FormLayout>
  )
}


