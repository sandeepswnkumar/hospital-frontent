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
import ThemeToggle from '@/components/ThemeToggle'

const Navbar = () => {
    // const { logout, userInfo } = useAuth()
    const logout = () => { }
    const { open } = useSidebar()
    return (
        <header
            className={"border-b dark:border-slate-850 flex h-14 items-center gap-2 z-10 px-4 section-grad-header justify-between"}
        // className={`fixed top-0  right-0  flex h-16 shrink-0 items-center gap-2  z-10  px-4 section-grad-header justify-between ${open
        //     ? ' transition-all left-[16rem] duration-[350ms]'
        //     : 'left-0'
        //     }`}
        >
            <div className="flex items-center">
                <SidebarTrigger className="-ml-1" />
                {/* <Separator orientation="vertical" className="mr-2 h-4" />
                <MainBreadcrumb key={window.location.pathname} /> */}
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="hidden md:inline text-slate-800 dark:text-slate-200">{"Sandeep Gupta"}</span>
                            {/* <span className="hidden md:inline text-slate-800 dark:text-slate-200">{userInfo?.full_name}</span> */}
                            <Avatar className="text-sm h-10 w-10">
                                <AvatarImage src="" className="bg-white " />
                                <AvatarFallback className="text-black dark:text-white dark:bg-slate-800">
                                    SG
                                    {/* {getFirstTwoChars(userInfo?.full_name)} */}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:bg-slate-900 dark:border-slate-850">
                        <DropdownMenuLabel className="dark:text-slate-200">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="dark:bg-slate-800" />
                        <DropdownMenuItem className="dark:text-slate-300 dark:focus:bg-slate-800">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-slate-300 dark:focus:bg-slate-800">Billing</DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-slate-300 dark:focus:bg-slate-800">Team</DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-red-400 dark:focus:bg-red-950/20" onClick={() => logout()}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Navbar
