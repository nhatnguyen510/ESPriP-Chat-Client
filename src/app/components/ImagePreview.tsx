import { PhotoView } from "react-photo-view";
import NextImage from "next/image";

type imagePreviewProps = {
  imageUrl: string;
};

export const ImagePreview: React.FC<imagePreviewProps> = ({ imageUrl }) => {
  return (
    <div className="flex h-full w-full cursor-pointer items-center justify-center">
      <PhotoView src={imageUrl}>
        <div className="relative">
          <NextImage
            src={imageUrl}
            alt="message"
            width="0"
            height="0"
            className="h-auto w-full rounded-lg"
            sizes="(max-width: 768px) 250px, (max-width: 1200px) 300px, 400px"
          />
        </div>
      </PhotoView>
    </div>
  );
};
