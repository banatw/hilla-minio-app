import { useTour } from "@reactour/tour"
import { ViewConfig } from "@vaadin/hilla-file-router/types.js"
import { useForm } from "@vaadin/hilla-react-form"
import { Signal, useSignal } from "@vaadin/hilla-react-signals"
import { Button, Dialog, FormLayout, HorizontalLayout, Notification, TextField, Upload, UploadBeforeEvent, UploadElement, VerticalLayout } from "@vaadin/react-components"
import UserModel from "Frontend/generated/com/example/application/data/UserModel"
import { ProfileService, UploadServices, UserEndpoint, UserService } from "Frontend/generated/endpoints"
import { menuSteps } from "Frontend/steps"
import { useAuth } from "Frontend/util/auth"
import { readAsDataURL } from "promise-file-reader"
import React from "react"
import { useEffect, useState } from "react"
import { Cropper, CropperRef } from "react-advanced-cropper"
import { CropperModal } from "./CropperModal"
import "react-advanced-cropper/dist/style.css";
import { FormControlLabel, Switch } from "@mui/material"
// import { Cropper, CropperRef } from "react-advanced-cropper"
// import { useParams } from "react-router"

// import "./Cropper.scss";


export const config: ViewConfig = {
    title: 'User Profile',
    loginRequired: true,
    menu: {
        exclude: true, title: 'User Profile'
    }
}

//Modal


export default function UserProfile() {
     const image = useSignal<string | undefined>(undefined)
     const imageResult = useSignal<string | undefined>(undefined)
     const modalOpen = useSignal<boolean>(false)
     const isDark = useSignal<boolean>(false)

     const saveTheme = ()=>{
      localStorage.removeItem('theme')
      localStorage.setItem('theme','dark')
     }

     

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
            const theme = localStorage.getItem('theme')
            if(theme) {
              if(theme === 'dark') isDark.value = true
            }
        })
      }
    
    fetchData()  
    },[])

     
     
    const removeUpload = ()=> {
      form.value.profilePictureMimeType=''
      form.value.hasProfilePicture=false
      image.value = undefined
      imageResult.value = undefined
    }
  return (
    <VerticalLayout>
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
          onUploadAbort={(e)=>{
            removeUpload()
          }}
        />
       {
        image.value &&  (
          <Button onClick={()=>removeUpload()}>Remove Profile Picture</Button>
        )
       }
        
        <div className="img-container">
          <img src={imageResult.value} className="circle-img" 
            alt=""
            width="200"
            height="200"
          />
        </div>
        <CropperModal modalOpen={modalOpen} image={image} imageResult={imageResult}   />
        <Button onClick={form.submit} disabled={form.submitting}>Simpan</Button>
    </VerticalLayout>
  )
}


