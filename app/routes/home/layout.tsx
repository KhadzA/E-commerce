import { Outlet } from "react-router";
import { useNavigate, Link } from "react-router";

function HomeLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {

        if (true) {
            navigate("/login?logout_success=true");
            return;
        } else {
        
        }
    };
    
    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="max-w-[300px] w-full space-y-6 px-4">
                <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                    <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <p className="leading-6 text-black dark:text-black text-center">
                            HOME LAYOUT
                        </p>


                        <button onClick={handleLogout}>Logout</button>

                    </nav>
                        
                    {/* This is where child route (Home.tsx) will render */}
                    <Outlet />
                </div>
            </div>
        </main>
    );
}

export default HomeLayout;
