"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileDown, ImageIcon } from "lucide-react"
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

interface PastedImage {
  id: string
  data: string
  name: string
}

export default function Aantekeningen() {
  const [aantekeningen, setAantekeningen] = useState<{ [key: string]: string }>({})
  const [images, setImages] = useState<{ [key: string]: PastedImage[] }>({})

  // Laad alle aantekeningen en afbeeldingen uit localStorage
  useEffect(() => {
    const loadedAantekeningen: { [key: string]: string } = {}
    const loadedImages: { [key: string]: PastedImage[] } = {}

    for (let i = 1; i <= 7; i++) {
      const aantekening = localStorage.getItem(`aantekening-${i}`)
      if (aantekening) {
        loadedAantekeningen[i] = aantekening
      }

      const savedImages = localStorage.getItem(`images-${i}`)
      if (savedImages) {
        loadedImages[i] = JSON.parse(savedImages)
      }
    }

    setAantekeningen(loadedAantekeningen)
    setImages(loadedImages)
  }, [])

  // Functie voor Datum van de sessie
  const sessiedatum = new Date().toLocaleDateString()
  // Functie voor titel in de PDF
  const titeltekst = `Aantekeningen Toepassen Redeneerlijn - ${sessiedatum}`

  // Functie om PDF te exporteren
  const exportPDF = async () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text(titeltekst, 20, 20)

    let y = 40

    for (let index = 0; index < balkenTitels.length; index++) {
      const titel = balkenTitels[index]
      const balkId = index + 1
      const aantekening = aantekeningen[balkId] || ""
      const balkImages = images[balkId] || []

      // Check if we need a new page
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(14)
      doc.text(`${balkId}. ${titel}`, 20, y)
      y += 10

      if (aantekening) {
        doc.setFontSize(12)
        const textLines = doc.splitTextToSize(aantekening, 160)
        doc.text(textLines, 20, y)
        y += textLines.length * 7
      }

      // Voeg afbeeldingen toe aan PDF
      for (const image of balkImages) {
        if (y > 200) {
          doc.addPage()
          y = 20
        }

        try {
          // Voeg afbeelding toe aan PDF
          doc.addImage(image.data, "JPEG", 20, y, 160, 100)
          y += 110
          doc.setFontSize(10)
          doc.text(image.name, 20, y)
          y += 10
        } catch (error) {
          console.error("Error adding image to PDF:", error)
        }
      }

      y += 10
    }

    doc.save(`aantekeningen-redeneerlijn-${new Date().toLocaleDateString()}.pdf`)
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
            const balkImages = images[balkId] || []

            return (
              <div key={balkId} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                <h2 className="text-xl font-semibold text-[#1e4b7a] mb-2">
                  {balkId}. {titel}
                </h2>
                {aantekening ? (
                  <div className="whitespace-pre-wrap mb-4">{aantekening}</div>
                ) : (
                  <div className="text-gray-500 italic mb-4">
                    Geen aantekeningen.{" "}
                    <Link href={`/balk/${balkId}`} className="text-[#1e4b7a] underline">
                      Voeg aantekeningen toe
                    </Link>
                  </div>
                )}

                {/* Toon afbeeldingen */}
                {balkImages.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-[#1e4b7a] mb-3 flex items-center gap-2">
                      <ImageIcon size={18} />
                      Geplakte afbeeldingen ({balkImages.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {balkImages.map((image) => (
                        <div key={image.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">{image.name}</span>
                          </div>
                          <img
                            src={image.data || "/placeholder.svg"}
                            alt={image.name}
                            className="max-w-full h-auto rounded border"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      ))}
                    </div>
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
