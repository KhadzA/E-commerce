import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  // State for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    } else {
      navigate("/home");
    }
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="max-w-[300px] w-full space-y-6 px-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-black dark:text-black text-center">
              LOGIN
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div>
                <label>Password:</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="leading-6 text-gray-700 dark:text-black text-center">
                <button type="submit">Login</button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </main>
  );
}

export default Login;
