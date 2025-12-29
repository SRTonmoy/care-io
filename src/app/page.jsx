import services from "@/data/services";
import ServiceCard from "@/components/ServiceCard";

export default function HomePage() {
  return (
    <div>
      {/* Banner */}
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">
          Trusted Care for Your Loved Ones
        </h1>
        <p className="max-w-xl mx-auto">
          Find reliable babysitters and caregivers for elderly and sick people.
        </p>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
