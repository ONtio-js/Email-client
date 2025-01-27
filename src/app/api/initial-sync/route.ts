import next from "next";
import { NextRequest, NextResponse } from "next/server"
import { Account } from "~/lib/account";
import { syncEmailsToDatabase } from "~/lib/sync-to-db";
import { db } from "~/server/db";

export const POST = async (req: NextRequest) => {
    const { accountId, userId} = await req.json();

    if(!accountId || !userId) return {
        status:400,
        json:{message:"missing accountId or userId"}
    }
    const dbAccount = await db.account.findUnique({
        where:{
            id: accountId.toString(),
            userId
        }
    });
    if (!dbAccount) return NextResponse.json({message:"account not found"},{status:404});

    const account = new Account(dbAccount.accessToken);
    const resposne = await account.performInitialSync();
    if(!resposne) return NextResponse.json({message:"failed to sync emails"},{status:500}); 

    const {emails, deltaToken} = resposne;
console.log(emails);
    await db.account.update({
        where:{
            id: accountId.toString()
        },
        data: {
            nextDeltaToken: deltaToken
        }
    })
    await syncEmailsToDatabase(emails,accountId);

    console.log('sync coompleted',deltaToken);
    return NextResponse.json({message:"sync completed"},{status:200});
}