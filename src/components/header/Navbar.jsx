// import { Separator } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'
// import MainBreadcrumb from './MainBreadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { useAuth } from '@/Context/AuthContext'
import { getFirstTwoChars } from '@/lib/helper'

const Navbar = () => {
    // const { logout, userInfo } = useAuth()
    const logout = () => { }
    const { open } = useSidebar()
    return (
        <header
            className={`fixed top-0  right-0  flex h-16 shrink-0 items-center gap-2  z-10  px-4 section-grad-header justify-between ${open
                ? ' transition-all left-[16rem] duration-[350ms]'
                : 'left-0'
                }`}
        >
            {/* <div className="flex items-center">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <MainBreadcrumb key={window.location.pathname} />
            </div> */}

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex items-end flex-col cursor-pointer">
                        <Avatar className="text-sm h-7 w-7">
                            <AvatarImage src="" className="bg-white " />
                            <AvatarFallback className="text-black">
                                ds
                                {/* {getFirstTwoChars(userInfo?.full_name)} */}
                            </AvatarFallback>
                        </Avatar>
                        <span>{"Sandeep Gupta"}</span>
                        {/* <span>{userInfo?.full_name}</span> */}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default Navbar
