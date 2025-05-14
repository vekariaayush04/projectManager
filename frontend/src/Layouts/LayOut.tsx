import NavBar from '@/components/NavBar'
import useUserStore from '@/store'
import { Outlet } from 'react-router-dom'

const LayOut = () => {
    const { user } = useUserStore()
  return (
    <div className="flex flex-col min-h-screen">
        <NavBar status={user ? 'LoggedIn' : 'LoggedOut'}/>
        <Outlet/>
    </div>
  )
}

export default LayOut