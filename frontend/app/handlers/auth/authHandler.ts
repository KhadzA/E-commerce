export const handleLogin = async ({
  email,
  password,
  setIsLoading,
  navigate,
}: {
  email: string;
  password: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (path: string) => void;
}): Promise<void> => {
  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  setIsLoading(true);

  try {
    // Step 1: Login
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed.");
      return;
    }

    const userId = String(data.user.id);

    // Step 2: Fetch profile for role — gracefully handle failures
    let role = "customer";
    let userName = "";

    try {
      const profileRes = await fetch(`http://localhost:5000/profile/${userId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        role = profileData.role || "customer";
        userName = profileData.name || "";
      }
    } catch {
      // Profile fetch failed — default to customer, login still succeeds
      console.warn("Could not fetch profile, defaulting to customer role.");
    }

    // Step 3: Persist to localStorage
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", userName);

    // Step 4: Route by role
    if (role === "admin") {
      navigate("/admin/home");
    } else {
      navigate("/customer/home");
    }
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

export const handleRegister = async ({
  email,
  password,
  name,
  setIsLoading,
  navigate,
}: {
  email: string;
  password: string;
  name: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate?: (path: string) => void;
}): Promise<void> => {
  if (!email || !password || !name) {
    alert("Please fill in all fields.");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful!");
    navigate?.("/login?registered=true");
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
