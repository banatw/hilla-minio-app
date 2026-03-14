import { StepType, useTour } from '@reactour/tour';
import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal, useSignal } from '@vaadin/hilla-react-signals';
import { AppLayout, Avatar, Button, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { ArsipSteps, menuSteps } from 'Frontend/steps';
import { useAuth } from 'Frontend/util/auth.js';
import React, { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';


const documentTitleSignal = signal('');
  effect(() => {
    document.title = documentTitleSignal.value;
  });

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title;
  const navigate = useNavigate();
  const location = useLocation();
  const {setIsOpen, setSteps, setCurrentStep}  = useTour()

  const steps = [
  {
    selector: '[data-tour="menu"]',
    content: 'Tampilan Menu',
  },
  // {
  //   selector: '[data-tour="arsip"]',
  //   content: 'tampilan arsip',
  //   action: ()=>navigate(`/arsip`),
  // },
  //  {
  //   selector: "[data-tour='add']",
  //   content: 
  //     <p>
  //       Klik disini untuk menambah arsip
  //     </p>
  //   ,
  // },
  // {
  //   selector: "[data-tour='action']",
  //   content: 
  //     <p>
  //       Klik disini untuk edit atau menghapus arsip
  //     </p>
    
  // },
  {
    selector: '[data-tour="logout"]',
    content: 'Klik disini untuk keluar',
  },
]

          
 
  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }
  }, [currentTitle]);

 

  const { state, logout } = useAuth();
  const profilePictureUrl =
    state.user &&
    `data:image;base64,${btoa(
      state.user.profilePicture.reduce((str, n) => str + String.fromCharCode((n + 256) % 256), ''),
    )}`;
  

  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className="flex flex-col justify-between h-full p-m">
        <header className="flex flex-col gap-m">
          <span className="font-semibold text-l">Hilla-Minio-App</span>
          <SideNav onNavigate={({ path }) => navigate(path!)} location={location} data-tour="menu">
            {createMenuItems().map(({ to, title, icon }) => (
              <SideNavItem path={to} key={to} >
                {icon ? <Icon src={icon} slot="prefix"></Icon> : <></>}
                {title}
              </SideNavItem>
            ))}
          </SideNav>
        </header>
        <footer className="flex flex-col gap-s">
          {state.user ? (
            <>
              <div className="flex items-center gap-s">
                <Avatar theme="xsmall" img={profilePictureUrl} name={state.user.name} />
                {state.user.name}
              </div>
              <Button theme='icon' aria-label='help'
                onClick={()=>{
                  if(setSteps) {
                    if(document.title.toLowerCase()==='arsip') {
                      setSteps(ArsipSteps)
                    }
                    else {
                      setSteps(menuSteps)
                    }
                  }
                  setCurrentStep(0)
                  setIsOpen(true)
                  console.log(document.title)
                }}
              >
                <Icon icon={'vaadin:question'} />
              </Button>
              <Button
                data-tour="logout"
                onClick={async () => {
                  await logout();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </footer>
        
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle" data-tour='burger'></DrawerToggle>
      <h1 slot="navbar" className="text-l m-0" >
        {documentTitleSignal}
      </h1>

      <Suspense>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
