import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/header/Navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import PageSidebar from '@/components/sidebar/PageSidebar'
// import ProtectedRoute from './ProtectedRoute'


function PageLayout() {
    return (
        <div className="w-screen h-screen relative bg-slate-50 dark:bg-[#0f1015] overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-teal-500/5 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
            </div>

            <SidebarProvider className="z-10">
                <PageSidebar />
                <SidebarInset className="h-screen bg-transparent">
                    <Navbar className="h-14" />
                    <div className="flex flex-col flex-1 overflow-y-auto p-2 gap-3 sm:p-3 lg:p-3 max-h-[calc(100vh - h-14)] relative">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default PageLayout;