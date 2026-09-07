function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-50 h-50 flex items-center justify-center gap-2">
        <span className="loading loading-ball loading-xs"></span>
        <span className="loading loading-ball loading-sm"></span>
        <span className="loading loading-ball loading-md"></span>
        <span className="loading loading-ball loading-lg"></span>
        <span className="loading loading-ball loading-xl"></span>
      </div>
    </div>
  );
}

export default Loading;
