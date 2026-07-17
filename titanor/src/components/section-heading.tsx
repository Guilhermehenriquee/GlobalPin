type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-sm font-black uppercase text-[#e30613]">{eyebrow}</p> : null}
        <h2 className="titan-title text-3xl text-white md:text-4xl">{title}</h2>
      </div>
      {description ? <p className="max-w-md text-sm leading-6 text-zinc-400">{description}</p> : null}
    </div>
  );
}
