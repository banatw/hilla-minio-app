import { useTour } from '@reactour/tour'
import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { useForm } from '@vaadin/hilla-react-form'
import { useSignal } from '@vaadin/hilla-react-signals'
import { Button, FormLayout, Notification, TextField, Upload, UploadBeforeEvent, VerticalLayout } from '@vaadin/react-components'
import ArsipModel from 'Frontend/generated/com/example/application/data/ArsipModel'
import { ArsipService } from 'Frontend/generated/endpoints'
import { ArsipAddSteps } from 'Frontend/steps'
import { readAsDataURL } from 'promise-file-reader'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useNavigation, useParams } from 'react-router'

const config: ViewConfig = {
    menu:{
        exclude: true
    },
    loginRequired: true,
    title: 'Arsip per username edit'
}
export default function EmployeeEdit() {
  const {id} = useParams()

  const navigate = useNavigate()
  const filePrev = useSignal('')

  const form = useForm(ArsipModel,{
    onSubmit: async (arsip) => {
        await ArsipService.saveEdit(arsip).then(result => {
          Notification.show(`Pegawai ${arsip.name} telah tersimpan`, { theme: 'success'})
          navigate(`/arsip_per_username`)
        }).catch(x => {
          Notification.show(`File Upload Kosong`,{ theme: 'error'})
        })
    }
  })
  

  useEffect(()=>{
    async function getData() {
      await ArsipService.getById(Number(id)).then(result => {
        form.read(result)
        filePrev.value = result.file
      })
    }
    getData()
  },[])

  const { setSteps } = useTour()

    useEffect(()=>{
      if(setSteps) setSteps(ArsipAddSteps)
    },[])
    const [uploadDisable, setUploadDisable] = useState(true)
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
            maxFiles={1}
            accept='application/pdf'
            onUploadBefore={async (e: UploadBeforeEvent) =>  {
              const file = e.detail.file
              e.preventDefault
              if(file) {
                form.value.file = await readAsDataURL(file)
                form.value.fileName = file.name
                form.value.mimeType = file.type
                filePrev.value = form.value.file
              }
            }}
        
        />
        <iframe src={filePrev.value} width={'300px'} height={'300px'} className='preview'></iframe>
        <Button onClick={form.submit} disabled={form.invalid} className='simpan'>Simpan</Button>
        <NavLink to={`/arsip_per_username`} className='kembali'>Kembali</NavLink>
        
    </FormLayout>
  )
}
