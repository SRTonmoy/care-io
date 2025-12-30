// Simple authentication library (in-memory storage for demo)
// In production, replace with database and proper authentication

let users = [
  {
    id: 1,
    email: "demo@care.io",
    password: "demo123", // In real app, store hashed passwords
    name: "Demo User",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
];

let sessions = [];

export class AuthService {
  // Register new user
  static async register(userData) {
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    
    // Create session
    const session = this.createSession(newUser.id);
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address
      },
      token: session.token
    };
  }

  // Login user
  static async login(email, password) {
    const user = users.find(user => 
      user.email === email && user.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const session = this.createSession(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address
      },
      token: session.token
    };
  }

  // Create session
  static createSession(userId) {
    const session = {
      id: sessions.length + 1,
      userId,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    sessions.push(session);
    return session;
  }

  // Validate session/token
  static async validateToken(token) {
    const session = sessions.find(s => 
      s.token === token && new Date(s.expiresAt) > new Date()
    );

    if (!session) {
      return null;
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address
    };
  }

  // Logout
  static async logout(token) {
    sessions = sessions.filter(s => s.token !== token);
    return true;
  }

  // Get user by ID
  static async getUserById(id) {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address
    };
  }

  // Update user
  static async updateUser(id, updates) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id // Ensure ID doesn't change
    };

    return {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      phone: users[userIndex].phone,
      address: users[userIndex].address
    };
  }
}

// Default export for convenience
export default AuthService;