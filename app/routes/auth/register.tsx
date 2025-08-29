import { useState } from "react";

function Register() {
  // State for input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
     <main className="flex items-center justify-center pt-16 pb-4">
      <div className="max-w-[300px] w-full space-y-6 px-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              REGISTER
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

              <div className="leading-6 text-gray-700 dark:text-gray-200 text-center">
                <button type="submit">Login</button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </main>
  );
}

export default Register;
