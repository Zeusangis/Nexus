import { toast } from "sonner";

//logout
export function logout() {
  // Check if token exists before removing
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // Clear user session or token
    localStorage.removeItem("accessToken");
    // Redirect to login page
    window.location.href = "/login";
    toast.success("Logged out successfully");
  } else {
    toast.error("No active session found");
  }
}
