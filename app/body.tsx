import { useCallback, useState, useEffect, FC } from "react";
import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"
import { Inventory } from "./inventory";
import { Canvas } from "./canvas";

import "./tailwind.css";
import "./layout.css";

export interface IBody
{
    supabase: SupabaseClient<Database, "public">;
};

export const Body: React.FC<IBody> = (props) => {
    const { supabase } = props;

    return (
        <div className="main border bg-neutral-900 text-white">
            <div className="left bg-neutral-800 gap-4"> 
                <Inventory supabase={supabase} />
            </div>
            <div className="flex">
                <Canvas supabase={supabase} />
            </div>
        </div>
    );
};
