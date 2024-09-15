
import { Button } from "./components/ui/button";
import { useCallback, useState, useEffect, FC } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"
import { Rows2 } from "lucide-react";
import { useTrackableObject } from "./trackableObject";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "./components/ui/table"

export interface IInventory
{
    supabase: SupabaseClient<Database, "public">;
};

export const Inventory: React.FC<IInventory> = (props) => {
    const { supabase } = props;
    
    const rows = useTrackableObject(supabase, "Items");
    const tableRows = [];

    for (const line of rows)
    {
        tableRows.push(
            <TableRow>
                <TableCell>{line.name}</TableCell>
            </TableRow>
        );
    }

    return (
        <div className="inventory">
            <div className="grid">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Items</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableRows}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
