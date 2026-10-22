export default function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/55 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-120 rounded-[14px] border border-olive/50 bg-white p-8 text-center sm:p-14"
      >
        <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-wine">
          <div className="h-2 w-4 -translate-y-px translate-x-0.5 -rotate-45 border-b-[1.5px] border-l-[1.5px] border-wine" />
        </div>
        <h3 className="text-stroke mb-5 font-italiana text-4xl leading-none tracking-[0.01em] text-ink">
          Message sent.
        </h3>
        <p className="mb-8 font-marcellus text-[17px] leading-snug font-light text-ink/70 italic">
          Thank you for reaching out. We&apos;ll reply within 24 hours.
        </p>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-[10px] border border-olive/30 bg-transparent px-8 py-3 font-marcellus text-sm text-ink"
        >
          Close
        </button>
      </div>
    </div>
  );
}
