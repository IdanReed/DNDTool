import { Button } from "./components/ui/button";
import { useCallback, useState, useEffect, FC } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"
import { Row, useTrackableObject } from "./trackableObject";

import "./layout.css";

const size = 25;
const xMax = 100;
const yMax = 100;

export interface ITile
{
    supabase: SupabaseClient<Database, "public">;
    row: Row<"Map">;
};
export const Tile: React.FC<ITile> = (props) => {
    const { supabase, row } = props;
    
    let color = "";

    switch(row.type)
    {
        case "Air":
            color = "white";
            break;
        case "Wall":
            color = "red";
            break;
    }

    const clickHandler = useCallback(async () => {
        const error = await supabase
            .from("Map")
            .update({ type: row.type == "Wall" ? "Air" : "Wall" })
            .eq('id', row.id)

        console.log(error);
    }, []);

    return (
        <div 
            key={row.id+color}
            className={["tile", color].join(" ")}
            style={{
                position: "absolute", 
                top: size * row.y,
                left: size * row.x,
                width: size,
                height: size,
                background: color
            }}
            onClick={clickHandler}
        >
        </div>
    );
};

export interface ICanvas
{
    supabase: SupabaseClient<Database, "public">;
};
export const Canvas: React.FC<ICanvas> = (props) => {
    const { supabase } = props;

    const deleteMap = useCallback(async () => {
        await supabase
            .from("Map")
            .delete().neq("id",0);
    }, []);

    const generateMap = useCallback(async () => {
        const rows: Row<"Map">[] = [];
        let id = 1;

        for (let x = 0; x < xMax; x++)
        {
            for (let y = 0; y < yMax; y++)
            {
                rows.push({
                    id: id, 
                    x: x, 
                    y: y, 
                    type: Math.random() < .8 ? "Air" : "Wall" 
                });
                id++;
            }
        }

        await supabase
            .from("Map")
            .insert(rows);
    }, []);

    const map = useTrackableObject(supabase, "Map");

    const tiles = [];
    
    for (const tile of map)
    {
        tiles.push(<Tile supabase={supabase} row={tile} />);
    }

    return (
        <div style={{display: "flex", rowGap: 10, flexDirection: "column"}}>
            <div style={{display: "flex", columnGap: 10, flexDirection: "row", margin: 10}}>
                <Button className="bg-neutral-700" onClick={generateMap}>Generate Map</Button>
                <Button className="bg-neutral-700" onClick={deleteMap}>Delete Map</Button>
            </div>
            <div 
                style={{position: "relative", margin: 10, width: 1000, height: 1000, overflow: "scroll"}} 
                className="border"
            >
                {tiles}
            </div>

        </div>

    );
};