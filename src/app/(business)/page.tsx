// 'use client';
// import { useUIStore } from '@/lib/store/auth/auth.store';
// import { useSession, signOut } from 'next-auth/react';
// import Link from 'next/link';
// //import { useQuery } from '@tanstack/react-query';

// // Example fetcher for notifications
// async function fetchNotifications() {
//   const res = await fetch('/api/notifications');
//   if (!res.ok) throw new Error('Failed');
//   return res.json();
// }

// export default function DashboardPage() {
//   const collapsed = useUIStore((s) => s.collapsed);
//   const toggle = useUIStore((s) => s.toggle);
//   const { data: session } = useSession();
//   //const { data: notifications } = useQuery(['notifications'], fetchNotifications, { staleTime: 10_000 });
//   return (
//     <div className='min-h-screen flex'>
//       <aside className={`w-64 border-r p-4 ${collapsed ? 'hidden' : ''}`}>
//         <div className='mb-6'>Logo</div>
//         <nav className='space-y-2'>
//           <Link href='/'>Home</Link>
//           <Link href='/settings'>Settings</Link>
//         </nav>
//         <button onClick={toggle} className='mt-4'>
//           Toggle collapse
//         </button>
//       </aside>
//       <main className='flex-1 p-6'>
//         <header className='flex items-center justify-between mb-6'>
//           <div>Search / breadcrumbs</div>
//           <div className='flex items-center gap-4'>
//             {/* <div className='relative'>
//               <button className='btn'>Notifications ({notifications?.length ?? 0})</button>
//             </div> */}
//             <div className='relative'>
//               <button className='flex items-center gap-2'>
//                 <img
//                   src={session?.user?.image ?? '/avatar-placeholder.png'}
//                   alt='avatar'
//                   className='w-8 h-8 rounded-full'
//                 />
//                 <span>{session?.user?.name ?? session?.user?.email}</span>
//               </button>
//               <div className='absolute right-0 mt-2 border bg-white rounded shadow p-2'>
//                 <Link href='/profile'>Profile</Link>
//                 <button onClick={() => signOut({ callbackUrl: '/login' })}>Log out</button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section>
//           <h1 className='text-2xl font-bold'>Welcome back</h1>
//           <p>This is your dashboard landing page.</p>
//         </section>
//       </main>
//     </div>
//   );
// }

'use client';

import { useSession } from 'next-auth/react';
import TopNotification from './custom/TopNotification';
import GetStarted from '../component/GetStarted';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Access Denied</p>;
  }

  return (
    <div className='flex flex-col item-start gap-4 m-0'>
      <TopNotification />
      <div className='mt-8 px-64 flex flex-col gap-3'>
        <GetStarted />
      </div>
    </div>
  );
}
