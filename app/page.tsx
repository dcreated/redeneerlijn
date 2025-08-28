import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e6f0f9] p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e4b7a]">Redeneerlijn Web Applicatie</h1>
          <p className="text-[#1e4b7a] mt-2">Interactieve tool voor het werken met de redeneerlijn methodiek</p>
          <div className="flex justify-end mt-4">
            <Link href="/aantekeningen">
              <Button
                variant="outline"
                className="bg-white text-[#1e4b7a] border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white"
              >
                Bekijk al je aantekeningen
              </Button>
            </Link>
          </div>
        </header>

        <div className="relative w-full">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/redeneerlijn%20-%20aangepast.jpg-7y0tE4AAMPGNdJajRRhXP45u8FWIIF.jpeg"
            alt="Redeneerlijn diagram"
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg shadow-md"
            priority
          />

          {/* Interactieve overlay voor de 7 balken */}
          <div className="absolute inset-0 grid grid-cols-7 gap-1">
            {[
              "(wettelijk) beschermde gebieden",
              "Maatregelen die nodig zijn om in te spelen op klimaatverandering",
              "Landgebruik dat afhankelijk is van specifieke natuurlijke / landschappelijke omstandigheden",
              "Duurzaam omgaan met ruimte en voorraden",
              "Ontwikkelingen die aansluiten op bestaande netwerken en deze versterken",
              "Opgaven gaan voor ambities",
              "Weeg toekomstbestendigheid en effecten op brede welvaart",
            ].map((titel, index) => (
              <Link
                key={index}
                href={`/balk/${index + 1}`}
                className="flex items-center justify-center h-full opacity-0 hover:opacity-100 hover:bg-[#1e4b7a]/20 transition-all duration-300 rounded"
              >
                <div className="bg-white/80 p-2 rounded text-center text-sm md:text-base">Klik voor details</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#1e4b7a] mb-3">Hoe werkt het?</h2>
            <p>
              Klik op één van de zeven balken in de redeneerlijn om details te bekijken en aantekeningen toe te voegen.
              Al je aantekeningen worden automatisch opgeslagen.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#1e4b7a] mb-3">Aantekeningen</h2>
            <p>
              Bekijk al je aantekeningen in één overzicht en exporteer ze als PDF document voor eenvoudig delen en
              archiveren.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#1e4b7a] mb-3">Aan de slag</h2>
            <p>
              Begin met het verkennen van de redeneerlijn door op de eerste balk te klikken of bekijk eerst het
              volledige overzicht.
            </p>
            <div className="mt-4">
              <Link href="/balk/1">
                <Button className="w-full bg-[#1e4b7a] hover:bg-[#16395d]">Start</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
