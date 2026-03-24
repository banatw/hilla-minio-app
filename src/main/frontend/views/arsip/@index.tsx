import {  useTour } from '@reactour/tour'
import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { AutoGrid, AutoGridRef } from '@vaadin/hilla-react-crud'
import { Button, GridColumn, HorizontalLayout, Icon, MenuBar, Notification, VerticalLayout } from '@vaadin/react-components'
import Arsip from 'Frontend/generated/com/example/application/data/Arsip'
import ArsipModel from 'Frontend/generated/com/example/application/data/ArsipModel'
import { ArsipService} from 'Frontend/generated/endpoints'
import { ArsipSteps } from 'Frontend/steps'
import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router'

export const config: ViewConfig = {
    menu: { order: 1, icon: 'line-awesome/svg/archive-solid.svg' },
    title: 'Arsip',
    rolesAllowed: ['ADMIN'],
}


export default function EmployeeIndex() {
  const autoGridRef = React.useRef<AutoGridRef>(null);
  const { setSteps } = useTour()

  useEffect(()=>{
    if(setSteps) setSteps(ArsipSteps)
  },[])

  const navigate = useNavigate()
  function actionRenderer({item: arsip} : {item: Arsip}) {
    return(
      
      <MenuBar items={[{text: 'Edit'},{text: 'Delete'}]} data-tour='action'
          onItemSelected={(event) => {
            const action = event.detail.value.text
            if(action.toLowerCase() === 'edit') {
              navigate(`/arsip/${arsip.id}`)
            }
            if(action.toLowerCase() === 'delete') {
              if(confirm("are u sure?")) {
                  ArsipService.delete(arsip).then(data => {
                  Notification.show(`Data ${data.name} telah dihapus`, { theme: 'contrast'})
                  autoGridRef.current?.refresh();
                })
              }
               
            }
          }}
      />
    )
  }

  return (
    <VerticalLayout className='h-full' >
      <HorizontalLayout>
        <Button onClick={()=>{
          navigate('/arsip/add')
        }} data-tour='add'>Add</Button>
        
        </HorizontalLayout>
        <AutoGrid service={ArsipService} model={ArsipModel} ref={autoGridRef}
          hiddenColumns={['file','mimeType','s3FileName']}
          customColumns={[
              <GridColumn key={'action'} renderer={actionRenderer} header='Action'  />
          ]}
        
        >
        </AutoGrid>
    </VerticalLayout>
  )
}
