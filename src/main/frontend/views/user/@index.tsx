import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useGridDataProvider } from "@vaadin/hilla-react-crud";
import { Signal, useSignal } from "@vaadin/hilla-react-signals";
import { Button, Checkbox, CheckboxGroup, Dialog, FormLayout, Grid, GridColumn, GridDataProvider, GridElement, HorizontalLayout, Icon, MenuBar, Notification, PasswordField, TextField, VerticalLayout } from "@vaadin/react-components";
import User from "Frontend/generated/com/example/application/data/User";
import { RoleService, UserService } from "Frontend/generated/endpoints";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm } from "@vaadin/hilla-react-form";
import UserModel from "Frontend/generated/com/example/application/data/UserModel";
import UserAction from "./_UserAction";

export const config: ViewConfig = {
    menu: { order: 1, icon: 'line-awesome/svg/user-solid.svg' },
    title: 'User',
    rolesAllowed: ['ADMIN'],
}

interface MyProps {
    modalOpen : Signal<boolean>
    user: User[]
    refreshGrid: ()=>void
}



export default function UserIndex() {
    const searchTerm = useSignal('')
    const modalOpen = useSignal<boolean>(false)
    const selectedItems = useSignal<User[]>([])
    const userId = useSignal<number | undefined>()
    const dataProvider = useGridDataProvider(
        async (pageable) => 
            await UserService.listWithFilter(pageable,searchTerm.value)
        ,[searchTerm.value]
    )

    const refreshGrid = ()=>{
        dataProvider.refresh()
    }

    function actionRenderer({item} : {item: User}) {
    return(
      
      <MenuBar items={[{text: 'Edit'},{text: 'Delete'}]} data-tour='action'
          onItemSelected={(event) => {
            const action = event.detail.value.text
            const user = item
            if(action.toLowerCase() === 'edit') {
                if(selectedItems.value.length === 0) {
                    modalOpen.value=false
                    Notification.show("User harus dipilih")
                    return
                }
               userId.value = user.id
               modalOpen.value=true
            }
            if(action.toLowerCase() === 'delete') {
                if(confirm('are u sure?')) {
                    UserService.delete(user.id)
                    refreshGrid()
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
            <HorizontalLayout theme="spacing">
                <Button onClick={()=>{
                userId.value = undefined
                modalOpen.value=true
                }} data-tour='add'>Add</Button>
                <Button onClick={()=>{
                    refreshGrid()
                }}>Refresh</Button>
            </HorizontalLayout>
        

        <Grid dataProvider={dataProvider} selectedItems={selectedItems.value} onActiveItemChanged={(e) => {
            const user = e.detail.value
            selectedItems.value = user? [user] : []
            userId.value = user?.id ? user.id : undefined
        }}>
            <GridColumn path="username" header={'Username'} />
            <GridColumn path="name" header="Name" />
            <GridColumn key={'action'} renderer={actionRenderer} header='Action'  />
            <span slot="empty-state">No user found.</span>
        </Grid>
        {selectedItems.value && <UserAction modalOpen={modalOpen} userId={userId.value} refreshGrid={refreshGrid} />  }
    </VerticalLayout>
    )
}