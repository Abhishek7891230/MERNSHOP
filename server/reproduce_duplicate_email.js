// Native fetch is available in Node 18+

const testDuplicateEmail = async () => {
    const url = 'http://localhost:5000/api/auth/register';
    const timestamp = Date.now();
    const email = `duplicate_test_${timestamp}@example.com`;

    const user1 = {
        username: `user1_${timestamp}`,
        email: email,
        password: 'password123',
        confirmPassword: 'password123'
    };

    const user2 = {
        username: `user2_${timestamp}`,
        email: email, // Exact same email
        password: 'password123',
        confirmPassword: 'password123'
    };

    const user3 = {
        username: `user3_${timestamp}`,
        email: email.toUpperCase(), // Same email, different case
        password: 'password123',
        confirmPassword: 'password123'
    };

    try {
        console.log(`\n--- Attempt 1: Registering ${user1.email} ---`);
        let response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user1)
        });
        console.log('Status 1:', response.status);

        console.log(`\n--- Attempt 2: Registering SAME email ${user2.email} ---`);
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user2)
        });
        console.log('Status 2:', response.status);

        console.log(`\n--- Attempt 3: Registering UPPERCASE email ${user3.email} ---`);
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user3)
        });
        console.log('Status 3:', response.status);

    } catch (error) {
        console.error('ERROR during fetch:', error.message);
    }
};

testDuplicateEmail();
