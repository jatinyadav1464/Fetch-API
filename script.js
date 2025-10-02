        document.addEventListener('DOMContentLoaded', function() {
            const contentElement = document.getElementById('content');
            const reloadButton = document.getElementById('reloadBtn');
            const searchInput = document.getElementById('searchInput');
            const viewToggle = document.getElementById('viewToggle');
            const sortBtn = document.getElementById('sortBtn');
            const totalUsersElement = document.getElementById('totalUsers');
            const uniqueCitiesElement = document.getElementById('uniqueCities');
            const companiesElement = document.getElementById('companies');
            
            let usersData = [];
            let isGridView = true;
            let isSortedAsc = true;

            //fetch and display user data
            function fetchUserData() {
                // Show loading 
                contentElement.innerHTML = `
                    <div class="loading" id="loading">
                        <div class="spinner"></div>
                        <p>Loading user data...</p>
                    </div>
                `;
                
                // Reset stats
                totalUsersElement.textContent = '0';
                uniqueCitiesElement.textContent = '0';
                companiesElement.textContent = '0';
                
                // Fetch data from API
                fetch('https://jsonplaceholder.typicode.com/users')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(users => {
                        usersData = users;
                        displayUsers(users);
                        updateStats(users);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        contentElement.innerHTML = `
                            <div class="error">
                                <h3><i class="fas fa-exclamation-triangle"></i> Error Loading Data</h3>
                                <p>${error.message}</p>
                                <p>Please check your internet connection and try again.</p>
                            </div>
                        `;
                    });
            }
            
            // Function to update
            function updateStats(users) {
                if (!users || users.length === 0) return;
                
                // counting up
                animateCount(totalUsersElement, users.length);
                
                // Count unique cities
                const cities = [...new Set(users.map(user => user.address.city))];
                animateCount(uniqueCitiesElement, cities.length);
                
                // Count companies
                const companies = [...new Set(users.map(user => user.company.name))];
                animateCount(companiesElement, companies.length);
            }
            
            // Function to animate counting
            function animateCount(element, target) {
                let current = 0;
                const increment = target / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 50);
            }
            
            // Function to display users in the DOM
            function displayUsers(users) {
                if (!users || users.length === 0) {
                    contentElement.innerHTML = '<div class="error">No user data available</div>';
                    return;
                }
                
                let usersHTML = isGridView ? '<div class="users-grid">' : '<div class="users-list">';
                
                users.forEach((user, index) => {
                    // Add delay for animation
                    const animationDelay = index * 0.1;
                    
                    usersHTML += `
                        <div class="user-card" style="animation-delay: ${animationDelay}s">
                            <div class="user-header">
                                <div class="user-id">ID: ${user.id}</div>
                                <div class="user-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <h2 class="user-name">${user.name}</h2>
                                <p class="user-username">@${user.username}</p>
                            </div>
                            <div class="user-body">
                                <div class="user-info">
                                    <div class="info-icon"><i class="fas fa-envelope"></i></div>
                                    <div>
                                        <span class="info-label">Email:</span>
                                        <span class="info-value">${user.email}</span>
                                    </div>
                                </div>
                                <div class="user-info">
                                    <div class="info-icon"><i class="fas fa-phone"></i></div>
                                    <div>
                                        <span class="info-label">Phone:</span>
                                        <span class="info-value">${user.phone}</span>
                                    </div>
                                </div>
                                <div class="user-info">
                                    <div class="info-icon"><i class="fas fa-globe"></i></div>
                                    <div>
                                        <span class="info-label">Website:</span>
                                        <span class="info-value">${user.website}</span>
                                    </div>
                                </div>
                                <div class="user-info">
                                    <div class="info-icon"><i class="fas fa-building"></i></div>
                                    <div>
                                        <span class="info-label">Company:</span>
                                        <span class="info-value">${user.company.name}</span>
                                    </div>
                                </div>
                                <div class="user-address">
                                    <div class="address-title"><i class="fas fa-map-marker-alt"></i> Address</div>
                                    <div>${user.address.street}, ${user.address.suite}</div>
                                    <div>${user.address.city}, ${user.address.zipcode}</div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                usersHTML += '</div>';
                contentElement.innerHTML = usersHTML;
            }
            
            // Function to search users
            function searchUsers(query) {
                if (!query.trim()) {
                    displayUsers(usersData);
                    updateStats(usersData);
                    return;
                }
                
                const filteredUsers = usersData.filter(user => 
                    user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase()) ||
                    user.address.city.toLowerCase().includes(query.toLowerCase())
                );
                
                displayUsers(filteredUsers);
                updateStats(filteredUsers);
            }
            
            // Function to sort users
            function sortUsers() {
                const sortedUsers = [...usersData].sort((a, b) => {
                    if (isSortedAsc) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
                
                isSortedAsc = !isSortedAsc;
                sortBtn.innerHTML = isSortedAsc ? 
                    '<i class="fas fa-sort-alpha-down"></i> Sort by Name' : 
                    '<i class="fas fa-sort-alpha-up"></i> Sort by Name';
                
                displayUsers(sortedUsers);
            }
            
            // Function to toggle view
            function toggleView() {
                isGridView = !isGridView;
                viewToggle.innerHTML = isGridView ? 
                    '<i class="fas fa-th"></i> Grid View' : 
                    '<i class="fas fa-list"></i> List View';
                
                // Update CSS for list view
                if (!isGridView) {
                    const style = document.createElement('style');
                    style.textContent = `
                        .users-list {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }
                        .users-list .user-card {
                            display: flex;
                            max-width: 100%;
                        }
                        .users-list .user-header {
                            min-width: 300px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        }
                        .users-list .user-body {
                            flex: 1;
                            display: flex;
                            flex-wrap: wrap;
                            gap: 20px;
                            align-items: center;
                        }
                        .users-list .user-info {
                            flex: 1;
                            min-width: 200px;
                            margin-bottom: 0;
                        }
                        .users-list .user-address {
                            flex-basis: 100%;
                            margin-top: 0;
                        }
                        @media (max-width: 768px) {
                            .users-list .user-card {
                                flex-direction: column;
                            }
                            .users-list .user-header {
                                min-width: auto;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                displayUsers(usersData);
            }
            
            // Initial data fetch
            fetchUserData();
            
            // Add event listeners
            reloadButton.addEventListener('click', fetchUserData);
            searchInput.addEventListener('input', (e) => searchUsers(e.target.value));
            viewToggle.addEventListener('click', toggleView);
            sortBtn.addEventListener('click', sortUsers);
        });