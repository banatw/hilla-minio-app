import { useTour } from '@reactour/tour'
import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { useForm } from '@vaadin/hilla-react-form'
import { Signal, useSignal } from '@vaadin/hilla-react-signals'
import { Button, FormLayout, HorizontalLayout, Notification, TextField, Upload, UploadBeforeEvent } from '@vaadin/react-components'
import ArsipModel from 'Frontend/generated/com/example/application/data/ArsipModel'
import { ArsipService } from 'Frontend/generated/endpoints'
import { ArsipAddSteps } from 'Frontend/steps'
import { readAsDataURL } from 'promise-file-reader'
import  { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'


export function OpenOnNewTab(base64: Signal<string | undefined>) {
    // const newTab: any = window.open()
    if(base64.value) {
      const data =  base64.value.split(',')
      const byteCharacters = atob(data[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const mimeType = data[0].split(':')
      const file = new Blob([byteArray], { type: mimeType[1] });
      const fileURL = URL.createObjectURL(file);
      // console.log(fileURL)
      window.open(fileURL)
      setTimeout(()=>URL.revokeObjectURL(fileURL),5000)
    }
      
   
  }

export const config: ViewConfig = {
    menu:{
        exclude: true
    },
    route: 'add',
    rolesAllowed: ['ADMIN']
}
export default function EmployeeAdd() {

    const navigate = useNavigate()
    useEffect(()=>{
        async function getData() {
          await ArsipService.add().then(form.read)
        }
        getData()
      },[])

    const { setSteps } = useTour()

    useEffect(()=>{
      if(setSteps) setSteps(ArsipAddSteps)
    },[])

  const filePrev = useSignal<string | undefined>(undefined)
  const [uploadDisable, setUploadDisable] = useState(true)
  const form = useForm(ArsipModel,{
    onSubmit: async (arsip) => {
        await ArsipService.save(arsip).then(result => {
          Notification.show(`Pegawai ${arsip.name} telah tersimpan`, { theme: 'success'})
          navigate(`/arsip`)
        }).catch(result => {
          Notification.show(`File Upload Kosong`,{ theme: 'error'})
        })
    }
  })
  
  



  return (
    <FormLayout style={{width: '100%'}} >
        <TextField {...form.field(form.model.name)} label={'Name'} className='keterangan' onValueChanged={(e)=>{
          if(e.detail.value === '') {
            setUploadDisable(true)
          }
          else {
            setUploadDisable(false)
          }
        }} />
        <Upload
          disabled = {uploadDisable}
          className='upload'  
          accept='application/pdf'
          maxFiles={1}
          onUploadBefore={
            async (e : UploadBeforeEvent) => {
              e.preventDefault()
              const file = e.detail.file
              if(form.value) {
                form.value.file = await readAsDataURL(file)
                form.value.mimeType = file.type
                form.value.fileName = file.name
                filePrev.value = form.value.file
                // console.log(form.value.file)
              }
            }
          }
        
        />
        
        <HorizontalLayout theme='spacing'>
          {
            filePrev.value && (
              <Button onClick={()=>OpenOnNewTab(filePrev)}>Buka di Tab Baru</Button>
            ) 
          }
          <Button onClick={form.submit} className='simpan'>Simpan</Button>
        </HorizontalLayout>
        <iframe src={filePrev.value} width={'300px'} height={'300px'} className='preview'></iframe>
        <NavLink to={`/arsip`} className='kembali'>Kembali</NavLink>
    </FormLayout>
  )
}
