import { useTour } from "@reactour/tour";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js"
import { useGridDataProvider } from "@vaadin/hilla-react-crud";
import { useSignal } from "@vaadin/hilla-react-signals";
import { VerticalLayout, TextField, Icon, Grid, GridSortColumn, Button, MenuBar, Notification, GridElement, GridColumn } from "@vaadin/react-components";
import Arsip from "Frontend/generated/com/example/application/data/Arsip";
import { ArsipPerUserService, ArsipService } from "Frontend/generated/endpoints";
import { ArsipSteps } from "Frontend/steps";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export const config: ViewConfig = {
    title: 'Arsip per user',
    rolesAllowed: ['ADMIN','USER'],
    menu:{
        title: 'Arsip per user',
        icon: 'line-awesome/svg/folder.svg'
    }
}


export default function ArsipPerUsernameIndex() {
    const searchTerm = useSignal('')
    const navigate = useNavigate()

     const { setSteps } = useTour()

  useEffect(()=>{
    if(setSteps) setSteps(ArsipSteps)
  },[])

    const dataProvider = useGridDataProvider(
      async (pageable) => await ArsipPerUserService.list(pageable, searchTerm.value),
      // Providing the search term as a dependency will automatically
      // refresh the data provider when the search term changes
      [searchTerm.value]
  );


  function actionRenderer({item: arsip} : {item: Arsip}) {
    return(
      
      <MenuBar items={[{text: 'Edit'},{text: 'Delete'}]} data-tour='action'
          onItemSelected={(event) => {
            const action = event.detail.value.text
            if(action.toLowerCase() === 'edit') {
              navigate(`/arsip_per_username/${arsip.id}`)
            }
            if(action.toLowerCase() === 'delete') {
                if(confirm("are u sure?")) {
                        ArsipService.delete(arsip).then(data => {
                        Notification.show(`Data ${data.name} telah dihapus`, { theme: 'contrast'})
                        dataProvider.refresh()
                    })
                }
            
            }
          }}
      />
    )
  }
    return (
         <VerticalLayout theme="spacing" className='h-full'>
            <TextField
                placeholder="Search"
                style={{ width: '50%' }}
                onValueChanged={(e) => {
                searchTerm.value = e.detail.value.trim();
                }}
            >
                <Icon slot="prefix" icon="vaadin:search" />
            </TextField>

        <Button onClick={()=>{
                  navigate('/arsip_per_username/add')
                }} data-tour='add'>Add</Button>

        <Grid dataProvider={dataProvider} >
            <GridColumn path="name" header={'Keterangan'} />
            <GridColumn path="fileName" header="Nama File" />
            <GridColumn key={'action'} renderer={actionRenderer} header='Action'  />
            <span slot="empty-state">No arsip found.</span>
        </Grid>
    </VerticalLayout>
    )
}