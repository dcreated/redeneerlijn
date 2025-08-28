import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Kaarten() {
  return (
    <main className="min-h-screen bg-[#e6f0f9] p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-[#1e4b7a]">
              <ArrowLeft size={16} />
              Terug naar redeneerlijn
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#1e4b7a] mb-6">Kaarten</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Grondwater beschermingsgebieden",
              "Natura 2000",
              "Beschermd stads-/dorpsgebied",
              "Water en bodem sturend in de ruimtelijke inrichting",
              "Zandgronden",
              "Veenweidegebieden",
              "Verstedelijkt gebied",
              "Stroomgebieden IJssel, Vecht en Delta",
              "Landbouwgebied met gebiedsspecifieke opgaven",
              "Voorkeursgebied wind",
              "Energienetwerk",
              "Stedelijk netwerk",
              "Mobiliteitsnetwerk",
              "Natuurnetwerk",
              "Klimaatmitigatie - CO2 vastlegging",
            ].map((kaart, index) => (
              <div key={index} className="bg-[#e6f0f9] p-4 rounded-lg border border-[#1e4b7a]/20">
                <h3 className="text-lg font-medium text-[#1e4b7a] mb-2">{kaart}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Klik om de kaart te bekijken en te interacteren met de gegevens.
                </p>
                <Button className="w-full bg-[#1e4b7a] hover:bg-[#16395d]">Bekijk kaart</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
