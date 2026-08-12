import { NavLink } from 'react-router-dom'
import BackIcon from '../Shared/BackIcon/BackIcon.tsx'
import './ManagementNav.css'

function ManagementNav({ showBackIcon = false }) {
  return (
    <nav className="management-nav" aria-label="Sections">
      <NavLink
        to="/records"
        className={({ isActive }) =>
          `management-nav-link ${isActive ? 'management-nav-link-active' : ''}`.trim()
        }
      >
        {showBackIcon ? (
          <span className="management-nav-icon" aria-hidden="true">
            <BackIcon />
          </span>
        ) : null}
        <span>Records</span>
      </NavLink>

      <NavLink
        to="/owners"
        className={({ isActive }) =>
          `management-nav-link ${isActive ? 'management-nav-link-active' : ''}`.trim()
        }
      >
        <span>Owners</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `management-nav-link ${isActive ? 'management-nav-link-active' : ''}`.trim()
        }
      >
        <span>Categories</span>
      </NavLink>
    </nav>
  )
}

export default ManagementNav
