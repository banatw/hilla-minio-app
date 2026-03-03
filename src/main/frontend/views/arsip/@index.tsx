import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { AutoGrid, AutoGridRef } from '@vaadin/hilla-react-crud'
import { Button, GridColumn, HorizontalLayout, MenuBar, Notification, VerticalLayout } from '@vaadin/react-components'
import Arsip from 'Frontend/generated/com/example/application/data/Arsip'
import ArsipModel from 'Frontend/generated/com/example/application/data/ArsipModel'
import { ArsipService} from 'Frontend/generated/endpoints'
import React from 'react'
import { NavLink, useNavigate } from 'react-router'

export const config: ViewConfig = {
    menu: { order: 1, icon: 'line-awesome/svg/archive-solid.svg' },
    title: 'Arsip',
    rolesAllowed: ['ADMIN'],
}

export default function EmployeeIndex() {
  const autoGridRef = React.useRef<AutoGridRef>(null);

  const navigate = useNavigate()
  function actionRenderer({item: arsip} : {item: Arsip}) {
    return(
      //   <HorizontalLayout>
      //     <Button onClick={()=>navigate(`/employee/${employee.id}`)}>Edit</Button>
      //     <Button onClick={()=>{
      //       EmployeeService.delete(employee).then(data => {
      //         Notification.show(`Data ${data.name} telah dihapus`)
      //         autoGridRef.current?.refresh();
      //       })
            
      //     }}  >Delete</Button>
      // </HorizontalLayout>
      <MenuBar items={[{text: 'Edit'},{text: 'Delete'}]}
          onItemSelected={(event) => {
            const action = event.detail.value.text
            if(action.toLowerCase() === 'edit') {
              navigate(`/arsip/${arsip.id}`)
            }
            if(action.toLowerCase() === 'delete') {
               ArsipService.delete(arsip).then(data => {
              Notification.show(`Data ${data.name} telah dihapus`, { theme: 'contrast'})
              autoGridRef.current?.refresh();
            })
            }
          }}
      />
    )
  }

  return (
    <VerticalLayout className='h-full'>
        <Button onClick={()=>{
          navigate('/arsip/add')
        }}>Add</Button>
        <AutoGrid service={ArsipService} model={ArsipModel} ref={autoGridRef}
          hiddenColumns={['file','mimeType','s3FileName']}
          customColumns={[
              <GridColumn key={'action'} renderer={actionRenderer} header='Action' />
          ]}
        
        >
        </AutoGrid>
    </VerticalLayout>
  )
}
