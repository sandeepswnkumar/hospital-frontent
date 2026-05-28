import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarGroupLabel } from '@/components/ui/sidebar'

const ParentLabel = ({ item }) => {
    // Dynamic icon resolver
    const getIcon = () => {
        if (item.icon && Icons[item.icon]) {
            return Icons[item.icon];
        }
        const titleMap = {
            'Dashboard': Icons.LayoutDashboard,
            'Patients': Icons.Users,
            'Appointments': Icons.Calendar,
            'Payments': Icons.CreditCard
        };
        return titleMap[item.title] || Icons.Stethoscope;
    };

    const IconComponent = getIcon();

    return item.items?.length > 0 ? (
        <SidebarGroupLabel
            asChild
            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
            <CollapsibleTrigger
                className={`hover:bg-transparent active:bg-transparent flex font-bold justify-between w-full `}
            >
                <span className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover/label:text-sidebar-accent-foreground" />}
                    <span>{item.title}</span>
                </span>
                <span>
                    {item.items?.length > 0 ? (
                        <Icons.ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    ) : null}
                </span>
            </CollapsibleTrigger>
        </SidebarGroupLabel>
    ) : (
        <NavLink
            to={item.url}
            className={({ isActive }) => {
                return isActive && item.items?.length == 0
                    ? 'bg-primary-red rounded-md'
                    : ''
            }}
        >
            <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
                <CollapsibleTrigger
                    className={`hover:bg-transparent flex justify-between w-full font-bold active:text-white `}
                >
                    <span className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 group-hover/label:text-sidebar-accent-foreground" />}
                        <span>{item.title}</span>
                    </span>
                    <span>
                        {item.items?.length > 0 ? (
                            <Icons.ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        ) : null}
                    </span>
                </CollapsibleTrigger>
            </SidebarGroupLabel>
        </NavLink>
    )
}

export default ParentLabel