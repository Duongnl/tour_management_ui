'use server'
import { setSessionId } from "@/utils/session_store"
export const LoginServerActions = async (account_name: string, password: string) => {

    // console.log(account_name, password)
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API_LOCALHOST}/auth/token`, {
        method: "POST",
        body: JSON.stringify({ account_name, password }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await res.json();
    if (data.status === "SUCCESS") {
        setSessionId(data.result.token);
    }


    return data;
}