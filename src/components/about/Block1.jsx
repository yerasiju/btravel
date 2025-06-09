import Image from "next/image";

const Block1 = () => {
  return (
    <>
      <div className="col-lg-5">
        <h2 className="text-30 fw-600">About BTravel</h2>
        <p className="mt-5">These popular destinations have a lot to offer</p>
        <p className="text-dark-1 mt-60 lg:mt-40 md:mt-20">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis
          alias at porro, quia et ducimus dicta illo quisquam vitae dolore
          reprehenderit minus id error omnis necessitatibus quos nobis. Aliquid,
          laboriosam.
          <br />
          <br />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni, amet,
          numquam non placeat nostrum blanditiis et laborum nobis beatae ducimus
          aliquid rerum dolorem recusandae perspiciatis magnam voluptatum minus!
          Dolor impedit incidunt quaerat numquam animi magnam minima illo.
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
