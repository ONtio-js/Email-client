import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './Nav'
import { File, Inbox, Send } from 'lucide-react'
import { api } from '~/trpc/react'
type Props = {
    isCollapsed:boolean
}
const SideBar = ({isCollapsed}:Props) => {
    const [accountId] =useLocalStorage('accountId','');
    const [tab] = useLocalStorage<"Inbox" | "Sent" | "Draft">(
      "Email-tab",
      "Inbox",
    );
    const {data:inboxThread} = api.account.getNumThreads.useQuery({
        accountId,tab:"Inbox"
    })
     const { data: draftThread } = api.account.getNumThreads.useQuery({
       accountId,
       tab: "Draft",
     });
      const { data: sentThread } = api.account.getNumThreads.useQuery({
        accountId,
        tab: "Sent",
      });
  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: inboxThread?.toString()??"0",
            icon: Inbox,
            variant: tab === "Inbox" ? "default" : "ghost",
          },
          {
            title: "Draft",
            label: draftThread?.toString()??"0",
            icon: File,
            variant: tab === "Draft" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: sentThread?.toString()??"0",
            icon: Send,
            variant: tab === "Sent" ? "default" : "ghost",
          },
        ]}
      />
    </>
  );
}

export default SideBar