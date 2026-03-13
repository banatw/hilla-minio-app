import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal, useSignal } from '@vaadin/hilla-react-signals';
import { AppLayout, Avatar, Button, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { useAuth } from 'Frontend/util/auth.js';
import React, { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { ShepherdJourneyProvider, useShepherd } from 'react-shepherd';
import { Step, StepOptions, Tour } from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const documentTitleSignal = signal('');
  effect(() => {
    document.title = documentTitleSignal.value;
  });

  const tourOptions = {
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        }
      },
      useModalOverlay: true,
    };

 

  function ButtonTour() {
    const Shepherd = useShepherd();
     const langkah: StepOptions[] = [
        {
          id: '1',
          text: '<p>Pilih menu</p>',
          attachTo: {
            element: '[data-tour="menu"]',
            on: 'auto'
          },
          buttons: [
            {
              text: 'Selanjutnya',
              action: ()=>tour.next()
            }
          ]
        },
        {
          id: '2',
          text: '<p>Keluar aplikasi</p>',
          attachTo: {
            element: '[data-tour="logout"]',
            on: 'auto'
          },
          buttons: [
            {
              text: 'Selesai',
              action: ()=>tour.complete()
            }
          ]
        }
      ]
  
    const tour = new Shepherd.Tour({
      ...tourOptions,
      steps: langkah
    })
    
    return(
         <Button onClick={tour.start}>Start Tour</Button>
    )
  }

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title;
  const navigate = useNavigate();
  const location = useLocation();
  
  
  
 
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
              <ShepherdJourneyProvider>
                <ButtonTour />
              </ShepherdJourneyProvider>
              <Button
                data-tour='logout'
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
