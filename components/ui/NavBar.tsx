"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import MobileNav from './MobileNav'
import { SignedIn, UserButton, useUser } from '@clerk/nextjs'

const NavBar = () => {
const {user} = useUser()
return (
    <nav className='flex flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10' >
      <Link href="/" className='flex items-center gap-1' >
        <Image src="/images/logo.png" width={40} height={40} alt='logo' className='max-sm:size-10' />
        <p className='text-[26px] font-extrabold text-white max-sm:hidden' >Vidmeet</p>
      </Link>
      <div className='flex-between gap-5 ' >
        <SignedIn>
          <UserButton /> <p className='text-white uppercase' >{user?.username}</p>
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  )
}

export default NavBar
