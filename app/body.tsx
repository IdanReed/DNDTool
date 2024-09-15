
import { Button } from "./components/ui/button";
import { useCallback, useState, useEffect, FC } from "react";
import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"
import { Inventory } from "./inventory";

import "./tailwind.css";
import "./layout.css";

export interface IBody
{
    supabase: SupabaseClient<Database, "public", any>;
};

export const Body: React.FC<IBody> = (props) => {
    const { supabase } = props;

    return (
        <div className="main border bg-neutral-950 shadow">
            <div className="left bg-neutral-900 gap-4"> 
                <Inventory supabase={supabase} />
            </div>
        </div>
    );
};
