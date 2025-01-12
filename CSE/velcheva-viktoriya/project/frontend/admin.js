document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');

    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        renderUsers(users);
    }

    function renderUsers(users) {
        userList.innerHTML = '';

        if (users.length === 0) {
            userList.innerHTML = '<p>No users found.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'user-table';

        const headers = ['Email', 'Role', 'Actions'];
        const headerRow = table.insertRow();
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        users.forEach((user, index) => {
            const row = table.insertRow();

            const emailCell = row.insertCell();
            emailCell.textContent = user.email;

            const roleCell = row.insertCell();
            roleCell.textContent = user.role;

            const actionsCell = row.insertCell();
            actionsCell.innerHTML = `
                <button onclick="editUser(${index})">Edit Role</button>
                <button onclick="deleteUser(${index})">Delete</button>
            `;
        });

        userList.appendChild(table);
    }

    window.editUser = function(index) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users[index];
        const newRole = prompt("Enter new role (user/admin):", user.role);

        if (newRole === 'user' || newRole === 'admin') {
            user.role = newRole;
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
        } else {
            alert("Invalid role!");
        }
    }

    window.deleteUser = function(index) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (confirm("Are you sure you want to delete this user?")) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
        }
    }

    loadUsers();
});
