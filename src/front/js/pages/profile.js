import React, { useContext } from 'react';
import { Context } from '../store/appContext';

const Profile = () => {
    const { store } = useContext(Context);

    if (!store.user) {
        return <p>No user data available</p>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p><strong>Name:</strong> {store.user.name}</p>
            <p><strong>Email:</strong> {store.user.email}</p>
        </div>
    );
};

export default Profile;
