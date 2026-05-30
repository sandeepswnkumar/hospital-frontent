import React from 'react'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getFirstTwoChars } from '@/lib/helper'
import ThemeToggle from '@/components/ThemeToggle'

const Navbar = ({ className = "" }) => {
    // const { logout, userInfo } = useAuth()
    const logout = () => { }
    return (
        <header
            className={`${className} bg-white/90 dark:bg-slate-950/90 border-b border-blue-200/70 dark:border-purple-400/20 shadow-sm shadow-blue-950/5 backdrop-blur flex items-center gap-2 z-10 px-4 justify-between shrink-0`}
        >
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-blue-700 hover:bg-blue-50 hover:text-purple-700 dark:text-blue-100 dark:hover:bg-white/10 dark:hover:text-white" />
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="hidden md:inline text-slate-800 dark:text-blue-50 font-semibold text-sm">{"Sandeep Gupta"}</span>
                            <Avatar className="text-sm h-8 w-8 border border-blue-200 dark:border-purple-400/30">
                                <AvatarImage src="" className="bg-white " />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-xs">
                                    SG
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-slate-950 border border-blue-100 dark:border-purple-400/20">
                        <DropdownMenuLabel className="text-slate-800 dark:text-slate-200">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                        <DropdownMenuItem className="text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">Billing</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">Team</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-450 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer" onClick={() => logout()}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default Navbar
