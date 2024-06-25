import { useFormContext } from "react-hook-form";

const MinesCountDisplay: React.FC = () => {
  const form = useFormContext();

  const minesCount = form.watch("minesCount");

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="relative flex h-[100px] flex-col items-start justify-between rounded-lg border border-zinc-800 p-3">
        <p className="text-lg font-semibold text-white">MINES</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-red-600 text-zinc-100">
          <span className="text-base font-semibold">{minesCount}</span>
        </div>
        <img
          src={"/imgs/mines/mine-count-img.png"}
          className="absolute bottom-0 right-0 z-10"
          alt="img_gem"
          width={62}
          height={62}
        />
        <img
          src={"/imgs/mines/mine-count-shade.png"}
          className="absolute bottom-0 right-0 z-0"
          alt="img_gem"
        />
      </div>
      <div className="relative flex h-[100px] flex-col items-start justify-between rounded-lg border border-zinc-800 p-3">
        <p className="text-lg font-semibold text-white">GEMS</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-green-500 text-zinc-100">
          <span className="text-base font-semibold">{25 - minesCount}</span>
        </div>
        <img
          src={"/imgs/mines/gem-count-img.png"}
          className="absolute bottom-0 right-0 z-10"
          alt="img_gem"
          width={62}
          height={62}
        />
        <img
          src={"/imgs/mines/gem-count-shade.png"}
          className="absolute bottom-0 right-0 z-0"
          alt="img_gem"
        />
      </div>
    </div>
  );
};

export default MinesCountDisplay;
