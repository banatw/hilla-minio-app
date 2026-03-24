export const menuSteps = [
    {
    selector: '[data-tour="menu"]',
    content: 'Tampilan Menu',
  },
   {
    selector: '.centextmenu',
    content: <p><b>Klik kanan</b> disini Setting aplikasi</p>,
  },
   {
    selector: '[data-tour="logout"]',
    content: 'Klik disini untuk keluar',
  },
] 

export const ArsipSteps = [
    {
    selector: "[data-tour='add']",
    content: 
      <p>
        Klik disini untuk menambah arsip
      </p>
    ,
  },
  {
    selector: "[data-tour='action']",
    content: 
      <p>
        Klik disini untuk edit atau menghapus arsip
      </p>
    
  },
  {
    selector: "[data-tour='burger']",
    content: 
      <p>
        Klik disini untuk menampilkan menu
      </p>
    
  },
]

export const UploadSteps = [
  {
    selector: ".upload",
    content: <p>
      Klik disini untuk upload
    </p>
  },
  {
    selector: "[data-tour='burger']",
    content: 
      <p>
        Klik disini untuk menampilkan menu
      </p>
    
  },
]

export const ArsipAddSteps = [
  {
    selector: '.keterangan',
    content: <p><b>Deskripsi File</b><br></br><i>harus diisi</i></p>
  },
  {
    selector: '.upload',
    content: <p>Upload file</p>
  },
  {
    selector: '.preview',
    content: <p>Preview file</p>
  },
  {
    selector: '.simpan',
    content: <p>Untuk menyimpan</p>
  },
  {
    selector: '.kembali',
    content: <p>Untuk keluar</p>
  },
]
