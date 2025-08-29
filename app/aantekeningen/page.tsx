"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileDown } from "lucide-react"
import jsPDF from "jspdf"

// Dummy data voor de balken (alleen titels)
const balkenTitels = [
  "(wettelijk) beschermde gebieden",
  "Maatregelen die nodig zijn om in te spelen op klimaatverandering",
  "Landgebruik dat afhankelijk is van specifieke natuurlijke / landschappelijke omstandigheden",
  "Duurzaam omgaan met ruimte en voorraden",
  "Ontwikkelingen die aansluiten op bestaande netwerken en deze versterken",
  "Opgaven gaan voor ambities",
  "Weeg toekomstbestendigheid en effecten op brede welvaart",
]

export default function Aantekeningen() {
  const [aantekeningen, setAantekeningen] = useState<{ [key: string]: string }>({})

  // Laad alle aantekeningen uit localStorage
  useEffect(() => {
    const loadedAantekeningen: { [key: string]: string } = {}

    for (let i = 1; i <= 7; i++) {
      const aantekening = localStorage.getItem(`aantekening-${i}`)
      if (aantekening) {
        loadedAantekeningen[i] = aantekening
      }
    }

    setAantekeningen(loadedAantekeningen)
  }, [])

  // Functie voor Datum van de sessie
  const sessiedatum = new Date().toLocaleDateString();
  // Functie voor titel in de PDF
  const titeltekst = `Aantekeningen Toepassen Redeneerlijn - ${sessiedatum}`;

  // Functie om PDF te exporteren
  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(titeltekst, 20, 20)

    let y = 40
    balkenTitels.forEach((titel, index) => {
      const balkId = index + 1
      const aantekening = aantekeningen[balkId] || ""
      doc.setFontSize(14)
      doc.text(`${balkId}. ${titel}`, 20, y)
      y += 10
      doc.setFontSize(12)
      const textLines = doc.splitTextToSize(aantekening, 160)
      doc.text(textLines, 20, y)
      y += textLines.length * 7
      y += 10
    })

    doc.save(`redeneerlijn-${new Date().toLocaleDateString()}.pdf`)
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
          <Button onClick={exportPDF} className="flex items-center gap-2 bg-[#1e4b7a] hover:bg-[#16395d]">
            <FileDown size={16} />
            Exporteer als PDF
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-[#1e4b7a] mb-6">Alle aantekeningen</h1>

          {balkenTitels.map((titel, index) => {
            const balkId = index + 1
            const aantekening = aantekeningen[balkId] || ""

            return (
              <div key={balkId} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                <h2 className="text-xl font-semibold text-[#1e3d6b] mb-2">
                  {balkId}. {titel}
                </h2>
                {aantekening ? (
                  <div className="whitespace-pre-wrap">{aantekening}</div>
                ) : (
                  <div className="text-gray-500 italic">
                    Geen aantekeningen.{" "}
                    <Link href={`/balk/${balkId}`} className="text-[#1e3d6b] underline">
                      Voeg aantekeningen toe
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
