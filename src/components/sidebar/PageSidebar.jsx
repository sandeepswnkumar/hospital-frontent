import React from 'react'
import SidebarItems from './SidebarItems'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from 'react-router-dom'
import { assets } from '@/assets/assets'
import { MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const PageSidebar = (props) => {
    return (
        <Sidebar
            {...props}
            className="border-r border-blue-900/20 dark:border-blue-950/40"
        >
            <SidebarHeader className="bg-transparent px-4 py-4">
                <SidebarMenu>
                    <SidebarMenuItem className="mb-4">
                        <SidebarMenuButton size="lg" className="hover:bg-transparent active:bg-transparent" asChild>
                            <Link to="/" className="flex justify-center">
                                <img
                                    src={assets.images.medicareLogo}
                                    alt="Logo"
                                    className="w-36"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Profile Card Section */}
                {/* <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/25 rounded-2xl mb-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-black dark:text-white dark:bg-slate-800 font-bold text-xs">SG</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#191c24] rounded-full" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-sm text-slate-700 dark:text-slate-200 leading-tight">Sandeep Gupta</span>
                            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Admin</span>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div> */}
            </SidebarHeader>
            <SidebarContent className="overflow-card-scroll-sidebar">
                <div className="px-4 py-2 text-xs font-bold text-blue-100/80 uppercase tracking-wider text-left">Navigation</div>
                <SidebarItems items={assets.data.SidebarMenu} />
            </SidebarContent>
        </Sidebar>
    )
}

export default PageSidebar
