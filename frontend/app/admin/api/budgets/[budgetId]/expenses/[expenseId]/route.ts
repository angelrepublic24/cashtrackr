import { verifySession } from "@/src/auth/dal";
import getToken from "@/src/auth/token";

export async function GET(req: Request, {params}: {params: {budgetId: string, expenseId: string}}) {
    await verifySession()

    const token = getToken();
    const url = `${process.env.API_URL}/budgets/${params.budgetId}/expenses/${params.expenseId}`;
    const request = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await request.json();
    if(!request.ok){
        return Response.json(data.message, { status: request.status } );
    }
    return Response.json(data );
}