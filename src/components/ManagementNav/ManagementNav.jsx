import { NavLink } from 'react-router-dom'
import './ManagementNav.css'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 18 9 12l6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  )
}

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
