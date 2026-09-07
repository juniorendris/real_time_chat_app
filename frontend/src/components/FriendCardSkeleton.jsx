// import React from 'react'

const FriendCardSkeleton = () => (
  <div className="card bg-base-300 w-full  shadow-lg mt-3 animate-pulse">
    <div className="card-body gap-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-base-content/20"></div>

          {/* Name + location */}
          <div className="flex flex-col gap-3">
            <div className="h-5 w-32 rounded bg-base-content/20"></div>
            <div className="h-4 w-24 rounded bg-base-content/20"></div>
          </div>
        </div>

        {/* Message button */}
        <div className="h-8 w-24 rounded-xl bg-base-content/20"></div>
      </div>

      {/* Bottom */}
      <div className="flex items-center gap-3 border-t border-t-gray-400 pt-3">
        <div className="h-4 w-20 rounded bg-base-content/20"></div>
        <div className="h-7 w-24 rounded-2xl bg-base-content/20"></div>
      </div>
    </div>
  </div>
);

export default FriendCardSkeleton;
