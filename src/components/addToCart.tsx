import { DocumentToUpload } from "../db utils/firebase utils"
export default function AddToCart() {
    return (
        <div>
            Add an item to wishlist
            <form action="">
                <label htmlFor="item-name">Item Name</label>
                <input type="text" name="item-name" className="bg-slate-100"/>
                <button type="submit">Button</button>
            </form>
        </div>
    )
}