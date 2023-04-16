import Image from 'next/image'

export default function EyeCatch({ title, image}) {
  return (
    <div>
      <figure>
        <Image 
          src={image.url} 
          alt="" 
          layout="responsive" 
          width={image.width}
          height={image.height}
          sizes="(min-width: 1152px)  1152px, 100vw" 
          priority
          blurDataURL={image.blurDataURL} 
          placeholder="blur"
        />
      </figure>  
    </div>
  )
}