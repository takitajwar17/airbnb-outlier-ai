"use client";

const ItineraryHeaderSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
        <div className="flex-grow">
          <div className="h-7 bg-neutral-200 rounded-md w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded-md w-1/4"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-10 bg-neutral-200 rounded-lg"></div>
          <div className="w-20 h-10 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>

      <div className="h-[40vh] bg-neutral-200 rounded-xl mb-8 relative"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-8/12">
          <div className="mb-6">
            <div className="h-7 bg-neutral-200 rounded-md w-1/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded-md w-1/3"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-2 border-neutral-200 pl-4 py-2">
                <div className="h-5 bg-neutral-200 rounded-md w-1/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-24 bg-neutral-200 rounded-md w-full mt-4"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-4/12">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="aspect-video w-full bg-neutral-200"></div>
            <div className="p-4">
              <div className="h-6 bg-neutral-200 rounded-md w-1/3 mb-4"></div>
              
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="h-4 bg-neutral-200 rounded-md w-24"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-16"></div>
                  </div>
                ))}
                
                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-neutral-200 rounded-md w-24"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-12"></div>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryHeaderSkeleton; 