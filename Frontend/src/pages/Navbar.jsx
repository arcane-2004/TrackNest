import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Need Help", path: "/help" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center gap-8 px-8 py-4
          rounded-2xl
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          shadow-lg
        "
      >
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `
              relative text-sm font-medium
              transition-all duration-300
              ${isActive
                ? "text-orange-400"
                : "text-white/80 hover:text-orange-300"}
              `
            }
          >
            {link.name}

            {/* Active underline */}
            <span
              className={`
                absolute left-0 -bottom-1 h-[2px] w-full
                rounded-full
                bg-orange-400
                transition-transform duration-300
                ${"scale-x-0 group-hover:scale-x-100"}
              `}
            />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
