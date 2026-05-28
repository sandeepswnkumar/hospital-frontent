import { Card, CardContent } from "@/components/ui/card"

export function HeaderCard({ children }) {
    return (
        <Card className="border-none  p-0">
            <CardContent className="px-0 py-4">
                {children}
            </CardContent>
        </Card>
    )
}

export default HeaderCard;