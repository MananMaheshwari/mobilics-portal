"use client"
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


const Sidebar = ({ params }) => {
    const pathname = usePathname();
    const { userID } = params;

    const [navigation, setNavigation] = useState([
        { name: 'My Profile', href: `/user/${userID}/MyProfile`, current: false },
        { name: 'My Connections', href: `/user/${userID}/MyConnections`, current: false }
    ])
    useEffect(() => {
        console.log("pathname: ", pathname);
        handleLinkClick(pathname);
    }, [])
    const handleLinkClick = (clickedHref) => {
        const updatedNavigation = navigation.map(item => ({
            ...item,
            current: item.href === clickedHref
        }));

        setNavigation(updatedNavigation);
    };

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <div className="bg-white hidden md:block w-1/3 lg:w-1/5 relative top-[-4rem] pt-5 ">
                <div className=' text-center w-2/3 mx-auto ring ring-gray-400 ring-opacity-30 p-1 rounded-sm mb-5'>
                    <h2 className='font-bold'>Dashboard</h2>
                </div>
                <div className="mx-auto p-4 space-y-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => handleLinkClick(item.href)}
                            className={classNames(
                                item.current ? 'block w-1/2  outline outline-2 outline-violet-950 outline-offset-0' : 'block w-1/2 text-gray-300 hover:outline outline-2 outline-offset-0 outline-violet-300 ',
                                'rounded-md px-3 py-2 text-sm text-violet-950 font-medium text-center mx-auto'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            {item.name}

                        </Link>
                    ))}
                </div>
            </div>
            <Disclosure  >
                {({ open }) => (
                    <div className={`bg-white h-screen ${open ? 'w-2/5' : 'w-0 p-0'} transition-width duration-300 ease-in-out`}>

                        <div className="absolute inset-y-0 left-0 flex items-center md:hidden">

                            <Disclosure.Button className="absolute left-4 top-4 rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                {open ? (
                                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </Disclosure.Button>
                        </div>
                        <Disclosure.Panel className="md:hidden">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => handleLinkClick(item.href)}
                                    className={classNames(
                                        item.current ? 'block   outline outline-2 outline-violet-950 outline-offset-0' : 'block text-gray-300 hover:outline outline-2 outline-offset-0 outline-violet-300 ',
                                        'rounded-md p-2 m-2 w-3/4 text-sm text-violet-950 font-medium text-center mx-auto'
                                    )}
                                    aria-current={item.current ? 'page' : undefined}
                                >
                                    {item.name}
                                    {/* current: {item.current} */}
                                </Link>
                            ))}
                        </Disclosure.Panel>


                    </div>
                )}
            </Disclosure>
        </>
    );
};

export default Sidebar;