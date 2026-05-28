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

    // Custom colored circle styling mapping
    const getIconContainerStyle = () => {
        const styles = {
            'Dashboard': 'bg-blue-500/15 text-blue-500 dark:text-blue-400',
            'Patients': 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
            'Appointments': 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
            'Payments': 'bg-red-500/15 text-red-500 dark:text-red-400'
        };
        return styles[item.title] || 'bg-teal-500/15 text-teal-500 dark:text-teal-400';
    };

    const containerStyle = getIconContainerStyle();

    return item.items?.length > 0 ? (
        <SidebarGroupLabel
            asChild
            className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
            <CollapsibleTrigger
                className={`hover:bg-transparent active:bg-transparent flex font-bold justify-between items-center w-full `}
            >
                <span className="flex items-center gap-3">
                    {IconComponent && (
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${containerStyle}`}>
                            <IconComponent className="w-4 h-4" />
                        </div>
                    )}
                    <span className="text-slate-650 dark:text-slate-300 group-hover/label:text-slate-900 dark:group-hover/label:text-white transition-colors">{item.title}</span>
                </span>
                <span>
                    {item.items?.length > 0 ? (
                        <Icons.ChevronRight className="ml-auto w-4 h-4 text-slate-450 dark:text-slate-500 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    ) : null}
                </span>
            </CollapsibleTrigger>
        </SidebarGroupLabel>
    ) : (
        <NavLink
            to={item.url}
            className={({ isActive }) => {
                return isActive && item.items?.length == 0
                    ? 'bg-slate-100 dark:bg-[#0f1015] rounded-xl block border-l-4 border-blue-500'
                    : 'block'
            }}
        >
            <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
                <CollapsibleTrigger
                    className={`hover:bg-transparent flex justify-between items-center w-full font-bold active:text-white `}
                >
                    <span className="flex items-center gap-3">
                        {IconComponent && (
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${containerStyle}`}>
                                <IconComponent className="w-4 h-4" />
                            </div>
                        )}
                        <span className="text-slate-650 dark:text-slate-300 group-hover/label:text-slate-900 dark:group-hover/label:text-white transition-colors">{item.title}</span>
                    </span>
                    <span>
                        {item.items?.length > 0 ? (
                            <Icons.ChevronRight className="ml-auto w-4 h-4 text-slate-450 dark:text-slate-500 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        ) : null}
                    </span>
                </CollapsibleTrigger>
            </SidebarGroupLabel>
        </NavLink>
    )
}

export default ParentLabel