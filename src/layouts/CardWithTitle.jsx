import { Card, CardContent } from "@/components/ui/card"

function CardWithTitle({ title, description, className, contentClass, children }) {
    return (
        <Card className="border-none p-0 m-0 h-full rounded-sm">
            <CardContent className={` h-full p-1 m-0 ${className}`}>
                <div className="border-b border-gray-200 border-dashed px-2 p-1 ">
                    {title && <h1 className="text-lg font-semibold">{title}</h1>}
                </div>
                <div className={`flex justify-between items-start p-2 mt-2 ${contentClass}`}>
                    {children}
                </div>
            </CardContent>
        </Card>
    )
}

export default CardWithTitle;