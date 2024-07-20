"use client"
import Image from "next/image"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { SidbarLinks } from "@/constant"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"


const MobileNav = () => {
    const pathname = usePathname()
  return (
    <section className='w-full max-w-[264px]' >
          <Sheet>
              <SheetTrigger asChild>
                <Image src= '/icons/burger.svg' height={36} width={36} alt="hamburger icon " className="cursor-pointer sm:hidden"  />
              </SheetTrigger >
              <SheetContent side="left" className="border-none bg-dark-1"  >
                  <Link href="/" className='flex items-center gap-1' >
                      <Image src="/images/logo.png" width={40} height={40} alt='logo' className='max-sm:size-10' />
                      <p className='text-[26px] font-extrabold text-white' >Video</p>
                  </Link>
                  <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto" >
                    <SheetClose asChild>
                        <section className="flex h-full flex-col gap-6 pt-16 text-white" >
                              {SidbarLinks.map((item) => {
                                  const isActive = pathname === item.route
                                  return (
                                      <SheetClose asChild key={item.label}>
                                      <Link href={item.route}  className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', { 'bg-blue-1': isActive })} >
                                          <Image src={item.imageUrl} alt={item.label} width={20} height={20} />
                                          <p className=' font-semibold ' >{item.label}</p>
                                      </Link>
                                      </SheetClose>
                                  )
                              })}
                        </section>
                    </SheetClose>
                  </div>
              </SheetContent>
          </Sheet>

    </section>
  )
}

export default MobileNav