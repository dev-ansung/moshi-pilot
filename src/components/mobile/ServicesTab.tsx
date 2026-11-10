"use client";

import { useState } from "react";
import { Compass, Sparkles } from "lucide-react";
import { Country } from "@/lib/mobile/countries";

interface ServiceItem {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  phone: string;
  hours: string;
  rule: string;
  defaultTopic: string;
}

const DIRECTORY: Record<string, ServiceItem[]> = {
  jp: [
    {
      id: "kyoto-hatago",
      name: "Kyoto Hatago Ryokan",
      nameLocal: "京都旅籠 旅館",
      category: "Hotel & Ryokan",
      phone: "+81 75-551-0000",
      hours: "Front desk 07:00–23:00 JST",
      rule: "Dinner strictly ends at 20:00; late check-in OK with prior notice",
      defaultTopic:
        "Notify venue that reservation will arrive late at 9:30 PM instead of 6:00 PM due to train delay. Hold our room.",
    },
    {
      id: "ginza-kura",
      name: "Ginza Kura Omakase",
      nameLocal: "銀座 鞍",
      category: "Restaurant",
      phone: "+81 3-5555-0123",
      hours: "18:00–23:00, closed Mondays",
      rule: "Changes/dietary requests require 48h notice by phone",
      defaultTopic:
        "Confirm our dinner reservation for 2 guests and ask if pescatarian options are available for one person.",
    },
    {
      id: "yamato-takkyubin",
      name: "Yamato Transport (Takkyubin)",
      nameLocal: "ヤマト運輸",
      category: "Delivery",
      phone: "0120-01-9625",
      hours: "08:00–21:00 daily",
      rule: "Address reroute must be confirmed by the sender",
      defaultTopic:
        "Check delivery status of luggage forwarding tracking #TK-88341 and request reroute to Tokyo hotel.",
    },
    {
      id: "mk-taxi",
      name: "MK Taxi Kyoto",
      nameLocal: "MKタクシー",
      category: "Taxi",
      phone: "+81 75-778-4141",
      hours: "24 hours",
      rule: "Reservations recommended for airport shuttles",
      defaultTopic: "Book a taxi for 2 passengers from our hotel to Kyoto Station tomorrow morning.",
    },
  ],
  kr: [
    {
      id: "seoul-taxi",
      name: "Seoul Call Taxi",
      nameLocal: "서울 콜택시",
      category: "Taxi",
      phone: "1588-1588",
      hours: "24 hours",
      rule: "Immediate dispatch by location",
      defaultTopic: "Please send a taxi for 2 passengers to our current location as soon as possible.",
    },
    {
      id: "incheon-lost",
      name: "Incheon Airport Lost & Found",
      nameLocal: "인천공항 유실물센터",
      category: "Airport",
      phone: "+82 32-741-3110",
      hours: "07:00–23:00 KST",
      rule: "Report within 3 days; claim in person or by authorized agent",
      defaultTopic: "Report lost item left at the airport and ask how to claim it or arrange delivery.",
    },
  ],
  fr: [
    {
      id: "paris-hotel",
      name: "Hôtel Le Marais",
      nameLocal: "Hôtel Le Marais",
      category: "Hotel",
      phone: "+33 1 42 72 38 48",
      hours: "Reception 24/7",
      rule: "Free cancellation until 18:00 on day of arrival",
      defaultTopic: "Please cancel our reservation for tonight. Are there any cancellation fees?",
    },
    {
      id: "g7-taxi",
      name: "G7 Taxi Paris",
      nameLocal: "G7 Taxi",
      category: "Taxi",
      phone: "+33 1 41 27 66 99",
      hours: "24/7",
      rule: "Immediate booking by phone",
      defaultTopic: "Book a taxi for 2 passengers to Charles de Gaulle Airport for tomorrow morning.",
    },
  ],
};

export function ServicesTab({
  country,
  onUseTopic,
}: {
  country: Country;
  onUseTopic: (topic: string, phone?: string) => void;
}) {
  const [q, setQ] = useState("");
  const items = DIRECTORY[country.code] || [];
  const filtered = items.filter((i) =>
    (i.name + i.category + (i.nameLocal || "")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white">
            {country.flag} {country.name} · service directory
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            Tap a service to load a ready-made call topic
          </div>
        </div>
        <Compass className="w-4 h-4 text-zinc-600" />
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search hotels, restaurants, taxis…"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
      />

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-600 font-mono">
          No services listed yet for {country.name}. Use the Call tab with any
          phone number.
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-white">{s.name}</div>
                {s.nameLocal && (
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {s.nameLocal}
                  </div>
                )}
                <span className="text-[10px] font-mono text-zinc-400">
                  {s.category}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                {s.phone}
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 space-y-0.5">
              <div>⏰ {s.hours}</div>
              <div>⚠️ {s.rule}</div>
            </div>
            <p className="text-[11px] text-zinc-300 italic line-clamp-2">
              &quot;{s.defaultTopic}&quot;
            </p>
            <button
              type="button"
              onClick={() => onUseTopic(s.defaultTopic, s.phone)}
              className="w-full py-2 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-zinc-100 transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" /> Use this call topic →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
