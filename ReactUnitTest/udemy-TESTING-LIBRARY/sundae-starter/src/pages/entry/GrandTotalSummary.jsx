import { useOrderDetails } from "../../context/OrderDetails"
import { formatCurrency } from "../../utilities"
export default function GrandTotalSummary() {
    const {
        totals : {scoops, toppings}
     } = useOrderDetails()
    return <h2>Grand total: {formatCurrency(scoops + toppings)}</h2>
}