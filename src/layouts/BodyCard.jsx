import { Card, CardContent } from "@/components/ui/card"

function BodyCard({ className, children }) {
    return (
        <Card className="border-none p-0 m-0 h-full">
            <CardContent className={` h-full p-1 m-0 ${className}`}>
                {children}
            </CardContent>
        </Card>
    )
}

export default BodyCard;