import React from "https://esm.sh/react@18.3.1";

function getHashPath() {
  const h = window.location.hash || "#/login";
  const path = h.startsWith("#") ? h.slice(1) : h;
  return path.startsWith("/") ? path : `/${path}`;
}

export function useHashRouter() {
  const [path, setPath] = React.useState(getHashPath());

  React.useEffect(() => {
    const onHash = () => setPath(getHashPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = React.useCallback((to) => {
    const next = to.startsWith("/") ? to : `/${to}`;
    window.location.hash = `#${next}`;
  }, []);

  return { path, navigate };
}

export function isRoute(path, base) {
  return path === base || path.startsWith(base + "/");
}

