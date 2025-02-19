import React from 'react'
import { api } from '~/trpc/react'
import {useLocalStorage} from 'usehooks-ts'
import { Select, SelectItem,SelectValue,SelectContent, SelectTrigger } from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { Plus } from 'lucide-react'
import { getAurinkoAuthUrl } from '~/lib/aurinko'
type Prop = {
    isCollapsed: boolean
}
const AccountSwitcher = ({isCollapsed}:Prop) => {
    const {data} = api.account.getAccount.useQuery();
    const [accountId,setAccountId] = useLocalStorage('accountId','')
    if(!data) return null;
  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="select an account">
          <span className={cn({ hidden: !isCollapsed },'capitalize font-bold text-2xl')}>
            {data.find((account) => account.id === accountId)?.emailAddress[0]}
          </span>
          <span className={cn({ hidden: isCollapsed, "ml-2": true })}>
            {data.find((account) => account.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data.map(account => (
            <SelectItem key={account.id} value={account.id}>
                {account.emailAddress}
            </SelectItem>
        ))}
        <div onClick={async()=> {
            const authurl = await getAurinkoAuthUrl("Office365");
                    window.location.href = authurl;
        }} className='flex relative hover:bg-gray-50 w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent'>
            <Plus className='size-4 mr-1' />
            Add account
        </div>
      </SelectContent>
    </Select>
  );
}

export default AccountSwitcher