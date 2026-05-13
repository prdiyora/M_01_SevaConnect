import { useEffect, useContext } from "react";
import { mountVercelToolbar, unmountVercelToolbar } from "@vercel/toolbar";
import { AuthContext } from "../context/AuthContext";

/**
 * Mounts the Vercel Toolbar only for admin team members.
 * Regular visitors will never see it or be prompted to log in.
 */
export function StaffToolbar() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;
    mountVercelToolbar();
    return () => unmountVercelToolbar();
  }, [isAdmin]);

  return null;
}
