import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
} from '@/components/ui/collapsible'
import {
    useSidebar,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuSub,
} from '@/components/ui/sidebar'
import ParentLabel from './ParentLabel‎'
import ChildLabel from './ChildLabel'
// import ParentLabel from './ParentLabel'
// import ChildLabel from './ChildLabel'

const SidebarItems = ({ items }) => {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        title={item.title}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup className="p-0">
                            <ParentLabel item={item} />
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    {item.items?.length ? (
                                        <SidebarMenuSub>
                                            {item.items.map((item) => (
                                                <ChildLabel key={item.title} item={item} />
                                            ))}
                                        </SidebarMenuSub>
                                    ) : null}
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default SidebarItems