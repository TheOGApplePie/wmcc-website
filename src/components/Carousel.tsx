interface SlideshowProps {
  content: {
    imgUrl: string;
    imgAlt: string;
    caption: string;
    buttonLink: string;
    buttonCaption: string;
  }[];
}
export default function Carousel({ content }: SlideshowProps) {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide background-gradient"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {content.map((slide, index) => {
          return (
            <div
              key={slide.caption}
              className={index == 0 ? "carousel-item active" : "carousel-item"}
            >
              <div
                className="container py-3"
                style={{ minHeight: "calc(100dvh - 120px)" }}
              >
                <div className="row">
                  <div className="col-6 p-3 d-none d-sm-flex flex-column">
                    <div className="flex-fill"></div>
                    <h1 className="fs-1 text-center text-white">
                      {slide.caption}
                    </h1>
                    <a className="text-end" href={slide.buttonLink}>
                      <button className="text-white fw-bold rounded border-0 p-3 bg-secondary-colour-green">
                        {slide.buttonCaption}
                      </button>
                    </a>
                    <div className="flex-fill"></div>
                  </div>
                  <div className="col-12 col-sm-6 d-flex flex-sm-row flex-column justify-content-center">
                    <img
                      className="img-fluid w-75 align-self-center shadow-sm"
                      src={slide.imgUrl}
                      alt={slide.imgAlt}
                    />
                    <a
                      className="text-center d-sm-none"
                      href={slide.buttonLink}
                    >
                      <button className="text-white fw-bold rounded border-0 p-3 bg-secondary-colour-green">
                        {slide.buttonCaption}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
