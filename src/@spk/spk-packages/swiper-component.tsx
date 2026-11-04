import React from 'react'

export type SwiperSlide = {
  id?: string | number
  title?: string
  text?: string
  description?: string
  image?: string
  img?: string
}

type SwiperComponentProps = {
  slides?: SwiperSlide[]
  className?: string
  spaceBetween?: number
  navigation?: boolean
  centeredSlides?: boolean
  autoplay?: boolean
  pagination?: boolean
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({
  slides = [],
  className = '',
}) => {
  if (!slides.length) {
    return <div className={className}>No slides available</div>
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {slides.map((slide, index) => {
        const image = slide.image ?? slide.img ?? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
        const title = slide.title ?? `Slide ${index + 1}`
        const body = slide.text ?? slide.description ?? 'A clean and modern authentication experience.'

        return (
          <div
            key={slide.id ?? `${title}-${index}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              textAlign: 'center',
              color: '#111827',
            }}
          >
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 16,
                display: 'block',
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{title}</h3>
              <p style={{ margin: '8px 0 0', color: '#6b7280', lineHeight: 1.5 }}>{body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SwiperComponent
