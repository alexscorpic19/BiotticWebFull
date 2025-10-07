import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons
import './carousel.css'

export const EmblaCarousel = ({ slides, onSelect }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const onSelectHandler = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      onSelect(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelectHandler)
    emblaApi.on('reInit', onSelectHandler)

    return () => {
      emblaApi.off('select', onSelectHandler)
      emblaApi.off('reInit', onSelectHandler)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="embla relative" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((slide, index) => (
          <div className="embla__slide" key={index}>
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.srcDesktop} />
              <source srcSet={slide.srcMobile} />
              <img src={slide.srcMobile} alt={slide.alt} className="embla__slide__img" />
            </picture>
          </div>
        ))}      </div>

      {/* Navigation Buttons */}
      {emblaApi && (
        <>
          <button
            className="embla__button embla__button--prev absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 z-20"
            onClick={() => emblaApi.scrollPrev()}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            className="embla__button embla__button--next absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/70 p-2 z-20"
            onClick={() => emblaApi.scrollNext()}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="embla__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default EmblaCarousel
