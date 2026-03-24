import { useTour } from '@reactour/tour'
import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { Notification, Upload, UploadElement, UploadRequestEvent, VerticalLayout } from '@vaadin/react-components'
import { UploadServices } from 'Frontend/generated/endpoints'
import { menuSteps, UploadSteps } from 'Frontend/steps'
import { useEffect } from 'react'

export const config: ViewConfig = {
    title: 'Upload',
    rolesAllowed: ['ADMIN'],
    menu: { order: 2, icon: 'line-awesome/svg/file-upload-solid.svg' },
}

export default function EmployeeAdd() {
  const { setSteps } = useTour()

  useEffect(()=>{
      if(setSteps) setSteps(UploadSteps)
    },[])
    
    const handleUploadRequest = async (e: UploadRequestEvent) => {
      e.preventDefault();

      const uploadRef = e.target as UploadElement

      const fileId = await UploadServices.uploadFile(e.detail.file)

      uploadRef.files = uploadRef.files.map((file) => {
        file.status = ''
        file.complete = true
        return file
      })
      
      Notification.show(`Received File : ${fileId}`)
    }

    return (
      <VerticalLayout>
          <Upload maxFiles={1} onUploadRequest={handleUploadRequest} className='upload' />
      </VerticalLayout>
    )
}
