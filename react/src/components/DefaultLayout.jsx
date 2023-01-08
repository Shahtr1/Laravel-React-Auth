import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
import axiosClient from "../axios.client.js";

export default function DefaultLayout() {
    const { user, token, notification, setUser, setToken, can } =
        useStateContext();

    if (!token) {
        return <Navigate to={"/login"} />;
    }

    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            console.log("data", data);
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                {can("read users") && <Link to="/users">Users</Link>}
            </aside>
            <div className="content">
                <header>
                    <div>Header</div>
                    <div>
                        {user.name}{" "}
                        <a className="btn-logout" href="#" onClick={onLogout}>
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>

            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}
