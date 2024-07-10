'use server'
export const LoginServerActions = async (account_name:string, password:string) => {
  

    console.log(account_name, password)
    const res = await fetch ("http://localhost:8080/api/auth/token", {
        method:"POST",
        body: JSON.stringify({account_name,password}),
        headers: {
                  'Content-Type': 'application/json'
        },
    })
    return await res.json();

}