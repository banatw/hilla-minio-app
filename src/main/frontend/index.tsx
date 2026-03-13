import { router } from 'Frontend/generated/routes.js';
import { AuthProvider } from 'Frontend/util/auth';
import { createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, useNavigate, useNavigation } from 'react-router';




function App() {
  const steps = [
  {
    selector: "[data-tour='menu']",
    content: 'Tampilan Menu',
  },
//   {
//     selector: "[data-tour='arsip']",
//     content: 'Arsip',
//   },
  {
    selector: '.logout',
    content: 'Klik disini untuk keluar',
  },
//   {
//     selector: '.tes',
//     content: 'Klik disini untuk tes',
//   }
  // ...
  {
    selector: "[data-tour='arsip']",
    content: 'List Arsip',
    action: ()=>{
      window.location.href='/arsip'
    }
  },
  {
    selector: "[data-tour='arsip']",
    content: 'List Arsip',
   
  },
]
  return (
    <AuthProvider>
          <RouterProvider router={router} />
    </AuthProvider>
  );
}



const outlet = document.getElementById('outlet')!;
let root = (outlet as any)._root ?? createRoot(outlet);
(outlet as any)._root = root;
root.render(createElement(App));
