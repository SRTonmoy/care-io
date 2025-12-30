import AuthService from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'login':
        const loginResult = await AuthService.login(data.email, data.password);
        return Response.json({
          success: true,
          user: loginResult.user,
          token: loginResult.token
        });

      case 'register':
        const registerResult = await AuthService.register(data);
        return Response.json({
          success: true,
          user: registerResult.user,
          token: registerResult.token
        });

      case 'validate':
        const user = await AuthService.validateToken(data.token);
        if (user) {
          return Response.json({ success: true, user });
        } else {
          return Response.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

      case 'logout':
        await AuthService.logout(data.token);
        return Response.json({ success: true });

      default:
        return Response.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const user = await AuthService.validateToken(token);
    if (user) {
      return Response.json({ success: true, user });
    } else {
      return Response.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}