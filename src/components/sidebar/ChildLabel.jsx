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
                <SidebarMenuSubButton asChild className="hover:bg-transparent active:bg-transparent hover:text-white active:text-white font-bold">
                    <span>{item.title}</span>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        </NavLink>
    )
}

export default ChildLabel