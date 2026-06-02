import { Card, CardContent } from "@/components/ui/card"

export function HeaderCard({ children }) {
    return (
        <Card className="border-none  p-0 bg-transparent shadow-none">
            <CardContent className="px-0 py-1 bg-transparent">
                {children}
            </CardContent>
        </Card>
    )
}

export default HeaderCard;