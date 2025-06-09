import Image from "next/image";

const Block1 = () => {
  return (
    <>
      <div className="col-lg-5">
        <h2 className="text-30 fw-600">About BTravel</h2>
        <p className="mt-5">These popular destinations have a lot to offer</p>
        <p className="text-dark-1 mt-60 lg:mt-40 md:mt-20">
          Welcome to btravel, where extraordinary adventures begin and lifelong
          memories are made. Our passion for exploration drives us to create
          exceptional travel experiences that go beyond ordinary tourism. We
          believe every journey should inspire, educate, and transform,
          connecting travelers with the authentic heart of each destination
          through carefully curated experiences and local insights.
          <br />
          <br />
          From exotic tropical paradises to historic European cities, from
          rugged wilderness expeditions to luxury resort escapes, btravel offers
          personalized travel solutions for every type of explorer. Our
          dedicated travel specialists work closely with you to design the
          perfect itinerary, ensuring every detail reflects your unique
          interests and travel style. Discover why discerning travelers choose
          btravel for their most important journeys.
        </p>
      </div>
      {/* End .col */}

      <div className="col-lg-6">
        <Image
          width={400}
          height={400}
          src="/img/pages/about/2.png"
          alt="image"
          className="rounded-4 w-100"
        />
      </div>
      {/* End .col */}
    </>
  );
};

export default Block1;
