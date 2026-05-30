import React, { useState } from 'react'
import { SidebarMenuSubButton, SidebarMenuSubItem } from '../ui/sidebar'
import { NavLink } from 'react-router-dom'

const ChildLabel = ({ item }) => {
    return (
        <NavLink
            to={item.url}
            className={({ isActive }) => {
                return isActive
                    ? 'bg-primary-red rounded-md '
                    : ''
            }
            }
        >
            <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild className="text-white/85 hover:bg-white/10 active:bg-white/10 hover:text-white active:text-white font-bold">
                    <span>{item.title}</span>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        </NavLink>
    )
}

export default ChildLabel
