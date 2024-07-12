'use server'
import { setSessionId } from "@/utils/session_store"
export const LoginServerActions = async (account_name: string, password: string) => {


    console.log(account_name, password)
    const res = await fetch("http://localhost:8080/api/auth/token", {
        method: "POST",
        body: JSON.stringify({ account_name, password }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const data = await res.json();
    if (data.status === "SUCCESS") {
        setSessionId(data.result.token)
    }

    return data;
}