"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Map } from "lucide-react"

// Dummy data voor de balken
const balkenData = [
  {
    id: 1,
    titel: "(wettelijk) beschermde gebieden",
    uitleg:
      "Deze balk betreft gebieden die (wettelijke) bescherming genieten, waaronder Grondwater beschermingsgebieden, Natura 2000 gebieden en beschermde stads- en dorpsgezichten. Bij ruimtelijke ontwikkelingen moet rekening gehouden worden met de beschermingsregimes die hier gelden.",
  },
  {
    id: 2,
    titel: "Maatregelen die nodig zijn om in te spelen op klimaatverandering",
    uitleg:
      "Deze balk gaat over maatregelen die nodig zijn om in te spelen op klimaatverandering, met water en bodem sturend in de ruimtelijke inrichting. De afweging en eventuele maatregelen zijn gebiedsgericht verschillend. We maken onderscheid in zandgronden, veenweidegebieden, verstedelijkt gebied en stroomgebieden IJssel, Vecht en Delta.",
  },
  {
    id: 3,
    titel: "Landgebruik dat afhankelijk is van specifieke natuurlijke / landschappelijke omstandigheden",
    uitleg:
      "Deze balk geeft functies die afhankelijk zijn van specifieke omstandigheden en plek in de ruimtelijk afweging. Deze functies zijn niet overal mogelijk en daarom zijn we hier zuinig op. Dit betreft landbouwgebied met gebiedsspecifieke opgaven en kansen, landbouwgebied met generieke opgaven en kansen, weidevogelgebieden en voorkeursgebied wind. Dit betekent niet dat die functies altijd voorgaan: wanneer er ruimte nodig is voor een collectieve verstedelijkingsopgave die is afgesproken in regionaal verband, of als elders al voldoende ruimte is voor de specifieke functies, dan weegt dat mee in de ruimtelijke afweging",
  },
  {
    id: 4,
    titel: "Duurzaam omgaan met ruimte en voorraden",
    uitleg:
      "Deze balk betreft inbreiding voor uitbreiding en meervoudig voor enkelvoudig, met focus op het duurzaam gebruik van beschikbare ruimte en voorraden. Is de gevraagde ruimte voor een functie meervoudig te benutten om zo meer doelen te realiseren? Of is er elders een plek voor de functies, bijvoorbeeld via inbreiding?",
  },
  {
    id: 5,
    titel: "Ontwikkelingen die aansluiten op bestaande netwerken en deze versterken",
    uitleg:
      "Deze balk omvat het energienetwerk, stedelijk netwerk, mobiliteitsnetwerk en natuurnetwerk. Welke relevante netwerken zijn er te onderscheiden? Het heeft de voorkeur om aan te sluiten op deze netwerken en ze te versterken door hierop voort te bouwen. De focus ligt op het versterken en benutten van bestaande infrastructuur en verbindingen, maar ook om sociale netwerken van inwoners en ondernemers.",
  },
  {
    id: 6,
    titel: "Opgaven gaan voor ambities",
    uitleg:
      "Deze balk vraagt om aan te onderbouwen waarom ruimte nodig is voor deze functie. Draagt dit bij aan programmeringsafspraken bedrijventerreinen, woondeelopgave en ambitie, duurzame energie opgave en ambitie, en klimaatmitigatie - CO2 vastlegging? Maak daarbij onderscheid tussen 'opgaven' (bijvoorbeeld woningaantallen in de woondeals) en 'ambities'. Wij willen alle opgaven in Overijssel realiseren en dat gaat voor als er ruimte wordt gevraagd voor een ambitie.",
  },
  {
    id: 7,
    titel: "Weeg toekomstbestendigheid en effecten op brede welvaart",
    uitleg:
      "Deze balk evalueert wat de effecten zijn op welzijn, gezondheid en welvaart, en vraagt of deze locatie ook op lange termijn volhoudbaar is.",
  },
]

export default function BalkDetail() {
  const params = useParams()
  const balkId = Number.parseInt(params.id as string)
  const balk = balkenData.find((b) => b.id === balkId) || balkenData[0]

  const [aantekening, setAantekening] = useState("")

  // Laad opgeslagen aantekeningen uit localStorage
  useEffect(() => {
    const savedAantekening = localStorage.getItem(`aantekening-${balkId}`)
    if (savedAantekening) {
      setAantekening(savedAantekening)
    }
  }, [balkId])

  // Sla aantekeningen op in localStorage
  const handleAantekeningChange = (value: string) => {
    setAantekening(value)
    localStorage.setItem(`aantekening-${balkId}`, value)
  }

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
          <Link href="/kaarten" className="hidden md:block">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white text-[#1e4b7a] border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white"
            >
              <Map size={16} />
              Naar de kaarten
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-xl md:text-2xl font-bold text-[#1e4b7a] mb-4">{balk.titel}</h1>
            <div className="prose max-w-none">
              <p>{balk.uitleg}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#1e4b7a] mb-4">Aantekeningen</h2>
            <Textarea
              placeholder="Voeg hier je aantekeningen toe..."
              className="min-h-[200px] border-[#1e4b7a]/30 focus:border-[#1e4b7a]"
              value={aantekening}
              onChange={(e) => handleAantekeningChange(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">Aantekeningen worden automatisch opgeslagen</p>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">Voortgang redeneerlijn</p>
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <Link key={step} href={`/balk/${step}`}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 ${
                        step === balkId ? "bg-[#1e4b7a] border-[#1e4b7a]" : "bg-white border-gray-300"
                      } cursor-pointer`}
                    />
                    <span className="text-xs mt-1">{step}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {balkId > 1 && (
            <Link href={`/balk/${balkId - 1}`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white text-[#1e4b7a] border-[#1e4b7a] hover:bg-[#1e4b7a] hover:text-white"
              >
                <ArrowLeft size={16} />
                Naar vorige
              </Button>
            </Link>
          )}
          {balkId < 7 && (
            <Link href={`/balk/${balkId + 1}`} className="ml-auto">
              <Button className="bg-[#1e4b7a] hover:bg-[#16395d]">Naar volgende</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

