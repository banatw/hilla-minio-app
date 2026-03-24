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

export const config: ViewConfig = {
    menu: { order: 1, icon: 'line-awesome/svg/user-solid.svg' },
    title: 'User',
    rolesAllowed: ['ADMIN'],
}

interface MyProps {
    modalOpen : Signal<boolean>
    user: User[]
}

function MyUserEdit ({modalOpen, user} : MyProps) {
    const { read, field, model,submit } = useForm(UserModel,{
        onSubmit: async (usersave)=> {
                 const id : number | undefined = user.at(0)?.id
                 if(id) {
                    await UserService.save(usersave).then((result)=>{
                    modalOpen.value = false
                })
                 }
                else {
                    await UserService.saveAdd(usersave).then((result)=>{
                    modalOpen.value = false
                    })
                }
              },
    })
    const [roles,setRoles] = useState<string[]>([])
    useEffect(()=>{
        const fetchData = async() => {
            const id : number | undefined = user.at(0)?.id
            if(id) {
                await UserService.get(id).then(read)
            }
            else {
                await UserService.newUser().then(read)
            } 
            await RoleService.roles().then(roles => setRoles(roles))
        }
        fetchData()
    }
    
    ,[user])

    return(
    <Dialog
        modeless
        headerTitle={'User Edit'}
        opened = {modalOpen.value}
       
        onClosed={()=>modalOpen.value = false}
        footer={
        <HorizontalLayout theme='spacing'>
            <Button onClick={submit}>Save</Button>
            <Button onClick={()=>{
                modalOpen.value=false
            }}>Cancel</Button>
        </HorizontalLayout>
        }
    >
        <FormLayout>
          <TextField {...field(model.username)} label={"Username"}   />
                  <TextField {...field(model.name)} label={"Name"}   />
                  <PasswordField {...field(model.hashedPassword)}label={'Password'}  />
                  <CheckboxGroup {...field(model.roles)}>
                      {
                      roles.map((value,index) => (
                          <Checkbox value={value} key={index} label={value}  />
                      ))
                      }
                  </CheckboxGroup>
                 
                 
          
        </FormLayout>

    </Dialog>
    )
}

export default function UserIndex() {
    const searchTerm = useSignal('')
    const modalOpen = useSignal<boolean>(false)
    const selectedItems = useSignal<User[]>([])
    const dataProvider = useGridDataProvider(
        async (pageable) => 
            await UserService.listWithFilter(pageable,searchTerm.value)
        ,[searchTerm.value]
    )

    function actionRenderer({item} : {item: User}) {
    return(
      
      <MenuBar items={[{text: 'Edit'},{text: 'Delete'}]} data-tour='action'
          onItemSelected={(event) => {
            const action = event.detail.value.text
            const user = item
            if(action.toLowerCase() === 'edit') {
                if(selectedItems.value.length !== 0) modalOpen.value=true
                else {
                    Notification.show("User harus dipilih")
                }
                // navigate(`/user/${item.id}`)
            }
            if(action.toLowerCase() === 'delete') {
                if(confirm('are u sure?')) {
                    UserService.delete(user.id)
                    dataProvider.refresh()
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
                selectedItems.value = []
                modalOpen.value=true
                }} data-tour='add'>Add</Button>
                <Button onClick={()=>{
                    dataProvider.refresh()
                }}>Refresh</Button>
            </HorizontalLayout>
        

        <Grid dataProvider={dataProvider} selectedItems={selectedItems.value} onActiveItemChanged={(e) => {
            const user = e.detail.value
            selectedItems.value = user ? [user] : []
        }}>
            <GridColumn path="username" header={'Username'} />
            <GridColumn path="name" header="Name" />
            <GridColumn key={'action'} renderer={actionRenderer} header='Action'  />
            <span slot="empty-state">No user found.</span>
        </Grid>
        {selectedItems.value && <MyUserEdit modalOpen={modalOpen} user={selectedItems.value}  />  }
    </VerticalLayout>
    )
}