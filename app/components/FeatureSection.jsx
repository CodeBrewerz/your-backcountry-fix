const FeatureSection = () => {
  return (
    <section aria-labelledby="cause-heading">
      <div className="relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/home-page-03-feature-section-full-width.jpg"
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-900 bg-opacity-50"
        />
        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* TODO Update feature section info */}
          <h2
            id="cause-heading"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Heading
          </h2>
          <p className="mt-3 text-xl text-white">
            lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <a
            href="#"
            className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
          >
            Check out
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
