import { Route, Routes } from 'react-router-dom'
import routes from './routes/routes.ts'
import NotFound from './components/NotFound/NotFound.tsx'
import "remixicon/fonts/remixicon.css";
function App() {
  return (
    <Routes>
      {routes.map((route, i) => {
        const Layout = route.layout
        return (
          <Route key={i} element={<Layout />}>
            {route.data.map((item) => {
              const Component = item.component
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  element={
                    // <PermissionCheck protectedRole={item.role}>
                    <Component />
                    // </PermissionCheck>
                  }
                />
              )
            })}
          </Route>
        )
      })}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
