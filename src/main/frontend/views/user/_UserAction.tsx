import { useForm } from "@vaadin/hilla-react-form"
import { Signal } from "@vaadin/hilla-react-signals"
import { Button, Checkbox, CheckboxGroup, Dialog, FormLayout, HorizontalLayout, PasswordField, TextField } from "@vaadin/react-components"
import User from "Frontend/generated/com/example/application/data/User"
import UserModel from "Frontend/generated/com/example/application/data/UserModel"
import { RoleService, UserService } from "Frontend/generated/endpoints"
import { useEffect, useState } from "react"

interface MyProps {
    modalOpen : Signal<boolean>
    userId: number | undefined
    refreshGrid: ()=>void
}
export default function UserAction({modalOpen, userId, refreshGrid} : MyProps) {
  const { read, field, model,submit } = useForm(UserModel,{
        onSubmit: async (usersave)=> {
                 if(userId) {
                    await UserService.save(usersave).then((result)=>{
                    refreshGrid()
                    modalOpen.value = false
                })
                 }
                else {
                    await UserService.saveAdd(usersave).then((result)=>{
                    refreshGrid()
                    modalOpen.value = false
                    })
                }
              },
    })
    const [roles,setRoles] = useState<string[]>([])
    useEffect(()=>{
        const fetchData = async() => {
            if(userId) {
                await UserService.get(userId).then(read)
            }
            else {
                await UserService.newUser().then(read)
            } 
            await RoleService.roles().then(roles => setRoles(roles))
        }
        fetchData()
    }
    
    ,[userId])

    return(
    <Dialog
        headerTitle={'User Add/Edit'}
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
