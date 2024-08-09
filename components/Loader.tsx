import Image from 'next/image';

export const Loader = () => {
  return (
    <div className="h-full gap-y-4 flex flex-col items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="logo" fill src="/logo.svg" />
      </div>
      <p className="text-muted-foreground text-sm">Genius is thinking...</p>
    </div>
  );
};
