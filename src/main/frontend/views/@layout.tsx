import { StepType, useTour } from '@reactour/tour';
import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal, useSignal } from '@vaadin/hilla-react-signals';
import { AppLayout, Avatar, Button, ContextMenu, DrawerToggle, Icon, SideNav, SideNavItem, Tooltip } from '@vaadin/react-components';
import { UploadServices } from 'Frontend/generated/endpoints';
import { ArsipSteps, menuSteps } from 'Frontend/steps';
import { useAuth } from 'Frontend/util/auth.js';
import React, { Suspense, useEffect, useState } from 'react';
import { data, Link, Outlet, useLocation, useNavigate } from 'react-router';


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

  useEffect(()=>{
    if(setSteps) setSteps(menuSteps)
  },[])
  
  const contextMenuItems = [
    { text: 'User profile'},
    { text: 'Tour aplikasi'},
  ]

  const { state, logout } = useAuth();

  const profilePictureUrl = useSignal('') 
  // const profilePictureUrl =
  //   state.user && 
  //   `${state.user.profilePicture}`;
  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }
  }, [currentTitle]);

 

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
              <ContextMenu items={contextMenuItems} onItemSelected={(e)=>{
                const menu = e.detail.value.text.toLowerCase()
                switch (menu) {
                  case 'tour aplikasi':
                    setCurrentStep(0)
                    setIsOpen(true)
                    break;
                  case 'user profile':
                    navigate(`/profile`)
                    break;
                  default:
                    break;
                }
              }}>
                <div className="flex items-center gap-s centextmenu">
                    <Avatar theme="xsmall"  img={state.user.profilePictureUriData}  name={state.user.name} id='profile'  />
                      {state.user.name}
                </div>
              </ContextMenu>
              
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
