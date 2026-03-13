import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { Notification, Upload, UploadElement, UploadRequestEvent, VerticalLayout } from '@vaadin/react-components'
import { UploadServices } from 'Frontend/generated/endpoints'

export const config: ViewConfig = {
    title: 'Upload',
    rolesAllowed: ['ADMIN'],
    menu: { order: 2, icon: 'line-awesome/svg/file-upload-solid.svg' },
}

export default function EmployeeAdd() {
    
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
      <VerticalLayout data-tour='upload'>
          <Upload maxFiles={1} onUploadRequest={handleUploadRequest} />
      </VerticalLayout>
    )
}
