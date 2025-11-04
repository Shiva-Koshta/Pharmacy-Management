import { useState } from "react";
import AddPurchaseForm from "./AddPurchase";
import ViewPurchases from "./ViewPurchases";
import ToggleBar from "../../../components/ToggleBar";

export default function Purchase() {
    const [viewMode, setViewMode] = useState("view");

    return (
        <div className="p-6">
            <ToggleBar viewMode={viewMode} setViewMode={setViewMode} />
            {viewMode === "add" ? <AddPurchaseForm /> : <ViewPurchases />}
        </div>
    );
}
