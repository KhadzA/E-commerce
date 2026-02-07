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
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed.");
      return;
    }

    // Store userId (temporary auth)
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("userEmail", data.user.email);

    // Simple role logic (optional)
    if (data.user.email === "admin@gmail.com") {
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

// TypeScript inline-typed params, navigate optional
export const handleRegister = async ({
  email,
  password,
  setIsLoading,
  navigate,
}: {
  email: string;
  password: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate?: (path: string) => void;
}): Promise<void> => {
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful!");

    // Optional: auto-redirect to login
    navigate?.("/login?registered=true");
  } catch (error) {
    console.error(error);
    alert("Server error. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
