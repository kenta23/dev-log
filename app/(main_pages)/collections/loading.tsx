import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loader className="animate-spin text-primary" size={32} />
    </div>
  );
}
