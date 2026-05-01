let users = [
    { id: 1, email: 'admin@mail.com', name: 'Admin', role: 'admin' },
    { id: 2, email: 'user@mail.com',  name: 'User',  role: 'user'  }
];

const getProfile = (user) => {
    const found = users.find(u => u.id === user.id);
    if (!found) throw new Error('User not found');
    return found;
};

const updateUser = (id, data) => {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    user.name  = data.name  || user.name;
    user.email = data.email || user.email;
    return user;
};

const getAllUsers = () => users;

module.exports = { getProfile, updateUser, getAllUsers };