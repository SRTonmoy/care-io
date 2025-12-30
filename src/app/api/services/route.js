import { services } from '@/data/services';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (id) {
      const service = services.find(s => s.id === parseInt(id));
      if (service) {
        return Response.json({ success: true, service });
      } else {
        return Response.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
    }

    if (category) {
      const filteredServices = services.filter(s => s.category === category);
      return Response.json({ success: true, services: filteredServices });
    }

    return Response.json({ success: true, services });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}