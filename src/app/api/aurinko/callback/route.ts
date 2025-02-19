import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions"
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";
import axios from "axios";

export const GET = async (req: NextRequest) => {
    const {userId} =  await auth();
    if(!userId) return NextResponse.json({message:"unauthorized"},{status:401});

    const params = req.nextUrl.searchParams;
    const status  = params.get('status');
    if(status === 'error') return NextResponse.json({message:"Failed to link account"},{status:400});

    const code = params.get('code');
    if(!code) return NextResponse.json({message:"no code provided"},{status:401});
    const token = await exchangeCodeForAccessToken(code);
    if(!token) return NextResponse.json({message:"Failed to exchange code for token"},{status:400});

    const accountDetails = await getAccountDetails(token.accessToken);

    await db.account.upsert({
        where:{
            id: token.accountId.toString()
        },
        create:{
            id: token.accountId.toString(),
            userId,
            accessToken: token.accessToken,
            emailAddress: accountDetails.email,
            provider:'aurinko',
            name: accountDetails.name,
            
        },
        update:{
            accessToken:token.accessToken,
        },
        
    })
    waitUntil(
        axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`,{
            accountId: token.accountId,
            userId
        }).then(response => {
            console.log('initial sync response',response.data);
        }).catch(error => {
            console.error('failed to trigger intial sync ',error);
        })
    )
return NextResponse.redirect(new URL('/mail',req.url));
}