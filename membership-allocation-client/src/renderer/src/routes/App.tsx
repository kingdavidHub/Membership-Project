import { Link, Outlet } from '@tanstack/react-router'
import { JSX } from 'react'

const App = (): JSX.Element => {
  return (
    <>
      <div>
        <nav>
          <Link to="/" className='text-black'>Home</Link> |{' '}
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}
export default App
