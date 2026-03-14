import { StepType, TourProvider } from '@reactour/tour';
import { router } from 'Frontend/generated/routes.js';
import { AuthProvider } from 'Frontend/util/auth';
import { createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, useNavigate, useNavigation, useRoutes } from 'react-router';




function App() {
  

  

  return (
    <AuthProvider>
        <TourProvider steps={[]}  >
          <RouterProvider router={router} />
        </TourProvider>
    </AuthProvider>
  );
}



const outlet = document.getElementById('outlet')!;
let root = (outlet as any)._root ?? createRoot(outlet);
(outlet as any)._root = root;
root.render(createElement(App));
