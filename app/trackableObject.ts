import { useCallback, useState, useEffect, FC } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"

type Tables = keyof Database["public"]["Tables"];
type Row<T extends Tables> = Database["public"]["Tables"][T]["Row"];

export const useTrackableObject = <T extends Tables>(
    supabase: SupabaseClient<Database, "public">,
    table: T
) => {
    const [lines, setLines] = useState<Row<T>[]>([]);

    useEffect(() => {
        const getInitialState = async () => {
            const { data, error } = await supabase
                .from(table)
                .select();
            
            const sorted = (data as Row<T>[]).sort((x, y) => {
                return x.id - y.id;
            });

            setLines([...(sorted as any)]);
        };

        getInitialState();
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                },
                (payload) => {
                    const getIndex = (searchLines: Row<T>[], searchRow: Row<T>) => {
                        if (searchLines.length > 0 && searchLines[searchLines.length - 1].id < searchRow.id)
                        {
                            return searchLines.length - 1;
                        }

                        return searchLines.findIndex((curRow, index) => {
                            if (curRow.id == searchRow.id)
                            {
                                return true;
                            }
                            else if (row.id > curRow.id && row.id < searchLines[index+1].id)
                            {
                                return true;
                            }
                            else
                            {
                                return false;
                            }
                        });
                    };

                    let row: Row<T>;
                    switch(payload.eventType)
                    {
                        case "UPDATE":
                            row = payload.new as Row<T>;
                            setLines((prev) => {
                                const newLines = [...prev];
                                const index = getIndex(newLines, row);
                                newLines.splice(index, 1, row);
                                return newLines;
                            });
                            break;
                        case "INSERT":
                            row = payload.new as Row<T>;
                            setLines((prev) => {
                                const newLines = [...prev];
                                const index = getIndex(newLines, row);
                                newLines.splice(index + 1, 0, row);
                                return newLines;
                            });
                            break;
                        case "DELETE":
                            row = payload.old as Row<T>;
                            setLines((prev) => {
                                const newLines = [...prev];
                                const index = getIndex(newLines, row);
                                newLines.splice(index, 1);
                                return newLines;
                            });
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return lines;
};
