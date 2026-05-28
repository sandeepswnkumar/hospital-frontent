import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/header/Navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import PageSidebar from '@/components/sidebar/PageSidebar'
// import ProtectedRoute from './ProtectedRoute'


function PageLayout({ children }) {
    return (
        <div className="w-screen h-screen">
            <SidebarProvider>
                <PageSidebar />
                <SidebarInset className="h-screen">
                    <Navbar />
                    {/* <ProtectedRoute> */}
                    <div className="flex flex-1 flex-col m-0 p-0 max-h-full">
                        <Outlet />
                    </div>
                    {/* </ProtectedRoute> */}
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default PageLayout;