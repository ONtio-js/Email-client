"use client"
import React from 'react'
import { Button } from './ui/button'
import { getAurinkoAuthUrl } from '~/lib/aurinko'

const LinkAccountButton = () => {
  return (
   <Button onClick={async () => {
        const authurl = await getAurinkoAuthUrl("Office365");
        window.location.href = authurl;
        console.log(authurl);
   }}>
    link account
   </Button>
  )
}

export default LinkAccountButton