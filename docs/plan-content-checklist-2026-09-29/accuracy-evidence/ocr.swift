import Foundation
import Vision
import ImageIO

var images: [[String: Any]] = []
for file in CommandLine.arguments.dropFirst() {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["ko-KR", "en-US"]
    request.usesLanguageCorrection = false
    let handler = VNImageRequestHandler(url: URL(fileURLWithPath: file))
    try handler.perform([request])
    let observations = (request.results ?? []).sorted {
        if abs($0.boundingBox.midY - $1.boundingBox.midY) > 0.012 {
            return $0.boundingBox.midY > $1.boundingBox.midY
        }
        return $0.boundingBox.minX < $1.boundingBox.minX
    }
    let lines: [[String: Any]] = observations.map { item in
        let best = item.topCandidates(1).first!
        return ["text": best.string, "confidence": best.confidence,
                "box": [item.boundingBox.minX, item.boundingBox.minY, item.boundingBox.width, item.boundingBox.height]]
    }
    images.append(["file": file, "lines": lines])
}
let json = try JSONSerialization.data(withJSONObject: images, options: [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes])
FileHandle.standardOutput.write(json)
