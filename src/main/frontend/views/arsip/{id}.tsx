import { useTour } from '@reactour/tour'
import { ViewConfig } from '@vaadin/hilla-file-router/types.js'
import { useForm } from '@vaadin/hilla-react-form'
import { Signal, useSignal } from '@vaadin/hilla-react-signals'
import { Button, FormLayout, HorizontalLayout, Notification, TextField, Upload, UploadBeforeEvent, VerticalLayout } from '@vaadin/react-components'
import ArsipModel from 'Frontend/generated/com/example/application/data/ArsipModel'
import { ArsipService } from 'Frontend/generated/endpoints'
import { ArsipAddSteps } from 'Frontend/steps'
import { readAsDataURL } from 'promise-file-reader'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useNavigation, useParams } from 'react-router'
import { OpenOnNewTab } from './add'
// import {Document, Page} from 'react-pdf'
// import { pdfjs } from 'react-pdf';
// import "react-pdf/dist/Page/TextLayer.css";
// import "react-pdf/dist/Page/AnnotationLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();



export const config: ViewConfig = {
    menu:{
        exclude: true
    },
    rolesAllowed: ['ADMIN']
}

interface props {
  base64: Signal<string | undefined>
}


export default function EmployeeEdit() {
  const {id} = useParams()

  const navigate = useNavigate()
  const filePrev = useSignal<string | undefined>()

  const form = useForm(ArsipModel,{
    onSubmit: async (arsip) => {
        await ArsipService.saveEdit(arsip).then(result => {
          Notification.show(`Pegawai ${arsip.name} telah tersimpan`, { theme: 'success'})
          navigate(`/arsip`)
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


  interface props {
    file : Signal<string | undefined>
  }
  
   

  const { setSteps } = useTour()

    useEffect(()=>{
      if(setSteps) setSteps(ArsipAddSteps)
    },[])
    const [uploadDisable, setUploadDisable] = useState(true)
    
  //    const [numPages, setNumPages] = useState<number>();
  // const [pageNumber, setPageNumber] = useState<number>(1);

  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }
  return (
    <FormLayout style={{width: '100%'}} theme='spacing'>
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
       
        <HorizontalLayout theme='spacing'>
                 {
                   filePrev.value && (
                     <Button onClick={()=>OpenOnNewTab(filePrev)}>Buka di Tab Baru</Button>
                   ) 
                 }
                 <Button onClick={form.submit} className='simpan'>Simpan</Button>
               </HorizontalLayout>
         <iframe src={filePrev.value} width={'300px'} height={'300px'} className='preview'></iframe>
          {/* <Document file={filePrev.value} onLoadSuccess={onDocumentLoadSuccess} options={options}>
            <Page pageNumber={pageNumber} />
          </Document> */}
        
        <NavLink to={`/arsip`} className='kembali'>Kembali</NavLink>
        
    </FormLayout>
  )
}
