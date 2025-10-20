export const handleLogin = ({
  email,
  password,
  setIsLoading,
  navigate,
}: {
  email: string;
  password: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (path: string) => void;
}): void => {
  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  setIsLoading(true);

  setTimeout(() => {
    if (email === "admin@gmail.com") {
      navigate("/admin/home?login_success=true");
    } else if (email === "user@gmail.com") {
      navigate("/customer/home?login_success=true");
    } else {
      alert("Invalid credentials.");
    }

    setIsLoading(false);
  }, 500);
};

// TypeScript inline-typed params, navigate optional
export const handleRegister = ({
  email,
  password,
  setIsLoading,
  navigate, // optional
}: {
  email: string;
  password: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate?: (path: string) => void;
}): void => {
  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  setIsLoading(true);

  // Simulate registration (replace with real API later)
  setTimeout(() => {
    console.log("Email:", email);
    console.log("Password:", password);
    alert("Registration successful!");
    setIsLoading(false);

    // If a navigate function was provided, redirect to login (or anywhere)
    if (typeof navigate === "function") {
      navigate("/login?registered=true");
    }
  }, 500);
};
