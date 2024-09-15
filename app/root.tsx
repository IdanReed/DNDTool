import {
Links,
Meta,
Outlet,
Scripts,
ScrollRestoration,
useLoaderData
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import { useCallback, useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { Database } from "../database.types"
import { Body } from "./body";

export const links: LinksFunction = () => [
{ rel: "preconnect", href: "https://fonts.googleapis.com" },
{
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
},
{
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
},
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
            {children}
            <ScrollRestoration />
            <Scripts />
        </body>
        </html>
    );
}

export const loader = async () => { 
    return { 
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY
    }; 
};

export default function App() {
    const [supabase, setSupabase] = useState<SupabaseClient<Database, "public", any> | null>(null);
    const env = useLoaderData<typeof loader>();

    useEffect(() => {
        if (env.SUPABASE_URL && env.SUPABASE_KEY)
        {
        const supabase = createClient<Database>(
            env.SUPABASE_URL, 
            env.SUPABASE_KEY
        );
        setSupabase(supabase);
        }
    }, []);

    return (
        <>
            <Layout> 
            { supabase ? 
                <Body supabase={supabase}/> 
                : <h1>No Supabase connection</h1>
            }
            </Layout>
        </>
    );
}
