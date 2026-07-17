import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999";
  const href = `https://wa.me/${number}?text=Quero%20comprar%20na%20TITANOR`;

  return (
    <a
      href={href}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#e30613]/50 bg-[#18a957] text-white shadow-2xl shadow-black/40 transition hover:scale-105"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a TITANOR no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
