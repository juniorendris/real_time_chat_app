const {pool} = require('./pool');

const createTable = async () => {
    const userTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullName VARCHAR(255) NOT NULL,
            email VARCHAR(191) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            image VARCHAR(255) DEFAULT '',
            skill VARCHAR(255) DEFAULT '',
            language VARCHAR(255) DEFAULT '',
            location VARCHAR(255) DEFAULT '',
            bio TEXT DEFAULT NULL,
            isOnboarded BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    const createUserFriendsTable = `
        CREATE TABLE IF NOT EXISTS user_friends (
            user_id INT NOT NULL,
            friend_id INT NOT NULL,

            PRIMARY KEY (user_id, friend_id),

            FOREIGN KEY (user_id) 
                REFERENCES users(id) 
                ON DELETE CASCADE,

            FOREIGN KEY (friend_id) 
                REFERENCES users(id) 
                ON DELETE CASCADE
        );
    `;

    try {
        await pool.execute(userTable);
        console.log('✔ users table created successfully');

        await pool.execute(createUserFriendsTable);
        console.log('✔ user_friends table created successfully');

    } catch (error) {
        console.error('❌ Error creating tables:', error);
    }
};
module.exports={createTable}