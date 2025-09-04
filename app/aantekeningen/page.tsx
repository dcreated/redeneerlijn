"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  const [overigeOpmerkingen, setOverigeOpmerkingen] = useState("")

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

    const savedOverigeOpmerkingen = localStorage.getItem("overige-opmerkingen")
    if (savedOverigeOpmerkingen) {
      setOverigeOpmerkingen(savedOverigeOpmerkingen)
    }
  }, [])

  // Functie voor Datum van de sessie
  const sessiedatum = new Date().toLocaleDateString()
  // Functie voor titel in de PDF
  const titeltekst = `Aantekeningen Toepassen Redeneerlijn - ${sessiedatum}`

  // Functie om PDF te exporteren
  const exportPDF = async () => {
    const doc = new jsPDF()

    // PDF marges definiëren
    const margins = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    }

    // Beschikbare breedte en hoogte berekenen
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const usableWidth = pageWidth - margins.left - margins.right
    const usableHeight = pageHeight - margins.top - margins.bottom

    // Titel toevoegen
    doc.setFontSize(18)
    doc.text(titeltekst, margins.left, margins.top + 10)

    let y = margins.top + 30

    for (let index = 0; index < balkenTitels.length; index++) {
      const titel = balkenTitels[index]
      const balkId = index + 1
      const aantekening = aantekeningen[balkId] || ""
      const balkImages = images[balkId] || []

      // Check if we need a new page voor de titel
      if (y > pageHeight - margins.bottom - 40) {
        doc.addPage()
        y = margins.top
      }

      // Balk titel toevoegen
      doc.setFontSize(14)
      const titelLines = doc.splitTextToSize(`${balkId}. ${titel}`, usableWidth)
      doc.text(titelLines, margins.left, y)
      y += titelLines.length * 7 + 5

      // Aantekening toevoegen als deze bestaat
      if (aantekening) {
        doc.setFontSize(12)
        const textLines = doc.splitTextToSize(aantekening, usableWidth)

        // Check if text fits on current page
        if (y + textLines.length * 7 > pageHeight - margins.bottom) {
          doc.addPage()
          y = margins.top
        }

        doc.text(textLines, margins.left, y)
        y += textLines.length * 7 + 10
      }

      // Afbeeldingen toevoegen
      for (const image of balkImages) {
        const imageHeight = 80
        const imageWidth = Math.min(usableWidth, 120)

        // Check if image fits on current page
        if (y + imageHeight + 20 > pageHeight - margins.bottom) {
          doc.addPage()
          y = margins.top
        }

        try {
          // Voeg afbeelding toe aan PDF
          doc.addImage(image.data, "JPEG", margins.left, y, imageWidth, imageHeight)
          y += imageHeight + 5
          doc.setFontSize(10)
          doc.text(image.name, margins.left, y)
          y += 15
        } catch (error) {
          console.error("Error adding image to PDF:", error)
        }
      }

      y += 10
    }

    // Voeg overige opmerkingen toe
    if (overigeOpmerkingen) {
      // Check if we need a new page
      if (y > pageHeight - margins.bottom - 60) {
        doc.addPage()
        y = margins.top
      }

      doc.setFontSize(14)
      doc.text("Overige opmerkingen", margins.left, y)
      y += 15

      doc.setFontSize(12)
      const overigeTextLines = doc.splitTextToSize(overigeOpmerkingen, usableWidth)

      // Check if text fits on current page
      if (y + overigeTextLines.length * 7 > pageHeight - margins.bottom) {
        doc.addPage()
        y = margins.top
        // Herhaal de titel op de nieuwe pagina
        doc.setFontSize(14)
        doc.text("Overige opmerkingen (vervolg)", margins.left, y)
        y += 15
        doc.setFontSize(12)
      }

      doc.text(overigeTextLines, margins.left, y)
    }

    doc.save(`aantekeningen-redeneerlijn-${new Date().toLocaleDateString()}.pdf`)
  }

  const handleOverigeOpmerkingenChange = (value: string) => {
    setOverigeOpmerkingen(value)
    localStorage.setItem("overige-opmerkingen", value)
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
                  <div className="text-gray-500 italic mb-4">Geen aantekeningen.</div>
                )}

                {/* Link om aantekeningen te wijzigen - niet in PDF export */}
                <div className="mb-4">
                  <Link href={`/balk/${balkId}`} className="text-[#1e4b7a] underline text-sm">
                    Wijzig aantekeningen
                  </Link>
                </div>

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

          {/* Overige opmerkingen sectie */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e4b7a] mb-4">Overige opmerkingen</h2>
            <Textarea
              placeholder="Voeg hier eventuele overige opmerkingen toe..."
              className="min-h-[120px] border-[#1e4b7a]/30 focus:border-[#1e4b7a]"
              value={overigeOpmerkingen}
              onChange={(e) => handleOverigeOpmerkingenChange(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">
              Overige opmerkingen worden automatisch opgeslagen en meegenomen in de PDF export.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
