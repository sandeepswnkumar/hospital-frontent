import React from 'react'
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
    const Icon = getIcon();

    // Custom colored circle styling mapping
    const getIconContainerStyle = () => {
        const styles = {
            'Dashboard': 'bg-white/15 text-white',
            'Hospitals': 'bg-violet-300/20 text-violet-200',
            'Doctors': 'bg-blue-300/20 text-blue-200',
            'Patients': 'bg-amber-300/20 text-amber-200',
            'Appointments': 'bg-emerald-300/20 text-emerald-200',
            'Payments': 'bg-rose-300/20 text-rose-200'
        };
        return styles[item.title] || 'bg-cyan-300/20 text-cyan-200';
    };

    const containerStyle = getIconContainerStyle();

    return item.items?.length > 0 ? (
        <SidebarGroupLabel
            asChild
            className="group/label text-sm text-white hover:bg-white/10 hover:text-white"
        >
            <CollapsibleTrigger
                className={`hover:bg-transparent active:bg-transparent flex font-bold justify-between items-center w-full `}
            >
                <span className="flex items-center gap-3">
                    {Icon && (
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${containerStyle}`}>
                            {React.createElement(Icon, { className: "w-4 h-4" })}
                        </div>
                    )}
                    <span className="text-white group-hover/label:text-white transition-colors">{item.title}</span>
                </span>
                <span>
                    {item.items?.length > 0 ? (
                        <Icons.ChevronRight className="ml-auto w-4 h-4 text-white/70 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    ) : null}
                </span>
            </CollapsibleTrigger>
        </SidebarGroupLabel>
    ) : (
        <NavLink
            to={item.url}
            className={({ isActive }) => {
                return isActive && item.items?.length == 0
                    ? 'bg-white/15 rounded-xl block border-l-4 border-white'
                    : 'block'
            }}
        >
            <SidebarGroupLabel
                asChild
                className="group/label text-sm text-white hover:bg-white/10 hover:text-white"
            >
                <CollapsibleTrigger
                    className={`hover:bg-transparent flex justify-between items-center w-full font-bold active:text-white `}
                >
                    <span className="flex items-center gap-3">
                        {Icon && (
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${containerStyle}`}>
                                {React.createElement(Icon, { className: "w-4 h-4" })}
                            </div>
                        )}
                        <span className="text-white group-hover/label:text-white transition-colors">{item.title}</span>
                    </span>
                    <span>
                        {item.items?.length > 0 ? (
                            <Icons.ChevronRight className="ml-auto w-4 h-4 text-white/70 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        ) : null}
                    </span>
                </CollapsibleTrigger>
            </SidebarGroupLabel>
        </NavLink>
    )
}

export default ParentLabel
