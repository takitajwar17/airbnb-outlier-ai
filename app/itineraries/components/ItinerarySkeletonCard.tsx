"use client";

const ItinerarySkeletonCard: React.FC = () => {
  return (
    <div 
      className="
        col-span-1 
        bg-white 
        rounded-xl 
        border 
        border-neutral-200
        overflow-hidden 
        animate-pulse
      "
    >
      <div className="flex flex-col gap-2 w-full">
        <div 
          className="
            aspect-video 
            w-full 
            relative 
            overflow-hidden 
            rounded-t-xl
            bg-neutral-200
          "
        />
        <div className="p-4">
          <div className="h-5 bg-neutral-200 rounded-md w-3/4 mb-4"></div>
          
          <div className="flex items-center gap-1 mt-2">
            <div className="w-4 h-4 bg-neutral-200 rounded-full" />
            <div className="h-3 bg-neutral-200 rounded-md w-1/2"></div>
          </div>
          
          <div className="flex items-center gap-1 mt-2">
            <div className="w-4 h-4 bg-neutral-200 rounded-full" />
            <div className="h-3 bg-neutral-200 rounded-md w-2/3"></div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-neutral-200 rounded-full" />
              <div className="h-3 bg-neutral-200 rounded-md w-20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 bg-neutral-200 rounded-md w-16"></div>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="h-3 bg-neutral-200 rounded-md w-14"></div>
            <div className="h-4 bg-neutral-200 rounded-md w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySkeletonCard; 