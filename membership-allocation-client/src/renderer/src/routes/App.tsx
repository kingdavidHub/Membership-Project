import { Link, Outlet } from '@tanstack/react-router'


export const App = (): JSX.Element => {
  return (
    <div>
      <nav>
        <Link to="/" className='text-black'>Home</Link> |{' '}
        <Link to="/login" className='text-black'>Login</Link> |{' '}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
