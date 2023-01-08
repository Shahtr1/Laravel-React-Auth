import { useEffect, useState } from "react";
import axiosClient from "../../axios.client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import "./Users.scss";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setNotification, can } = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        axiosClient.delete(`/users/${u.id}`).then(() => {
            setNotification("User was successfully deleted");
            getUsers();
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                {can("create users") && (
                    <Link to="/users/new" className="btn-add">
                        Add new
                    </Link>
                )}
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Creation Date</th>
                            {(can("update users") || can("delete users")) && (
                                <th>Actions</th>
                            )}
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    {(can("update users") ||
                                        can("delete users")) && (
                                        <td>
                                            <div className="action-wrapper">
                                                {can("update users") && (
                                                    <Link
                                                        to={"/users/" + u.id}
                                                        className="btn-edit"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {can("delete users") && (
                                                    <button
                                                        onClick={(ev) =>
                                                            onDelete(u)
                                                        }
                                                        className="btn-delete"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
}
