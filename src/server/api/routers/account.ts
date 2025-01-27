import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";
export const authorizeAccountAccess = async (accountId: string, userId: string) => {
const account = await db.account.findFirst({
    where:{
        id:accountId,
        userId
    },
    select:{
        id:true, emailAddress:true,name:true
    }
});
if(!account) throw new Error('no account found');
return account;
}
export const accountRouter = createTRPCRouter({
    getAccount: privateProcedure.query(async({ctx}) => {
        return await ctx.db.account.findMany({
            where:{
                userId:ctx.auth.userId
            },
            select:{
                id:true,emailAddress:true,name:true
            }
        })
    }),
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string()
    })).query(async ({ctx, input}) => {
        const account = await authorizeAccountAccess(input.accountId,ctx.auth.userId);
        let filter:Prisma.ThreadWhereInput = {};
        if(input.tab == 'Inbox'){
            filter.inboxStatus = true;
        }else if( input.tab == "Draft"){
            filter.draftStatus = true;
        }else if(input.tab == "Sent"){
            filter.sentStatus = true
        }
        return await ctx.db.thread.count({
            where:{
                accountId: account.id,
                ...filter
            }
        })
    }),
    getThread: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.string()
    }))
})