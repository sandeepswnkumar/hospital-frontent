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

const PageSidebar = (props) => {
    return (
        <Sidebar {...props} >
            <SidebarHeader className=" bg-transparent">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent active:bg-transparent" asChild>
                            <Link to="/" className="flex justify-center">
                                <img
                                    src={assets.images.adminLoginBg}
                                    alt="Logo"
                                    className="w-36"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="section-grad-sidebar overflow-card-scroll-sidebar">
                <SidebarItems items={assets.data.SidebarMenu} />
            </SidebarContent>
        </Sidebar>
    )
}

export default PageSidebar